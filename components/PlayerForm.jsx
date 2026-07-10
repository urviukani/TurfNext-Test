"use client";

import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CustomSelect from "./CustomSelect";
import OtpInput from "./OtpInput";
import RadioChipGroup from "./RadioChipGroup";
import SuccessView from "./SuccessView";
import Toast from "./Toast";
import { authApi } from "@/lib/api/auth";

const DEFAULT_CITIES = [
  "Indore",
  "Bhopal",
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Ahmedabad",
  "Jaipur",
  "Chennai",
  "Kolkata",
];

const SPORTS = [
  { value: "Football", label: "⚽ Football" },
  { value: "Cricket", label: "🏏 Cricket" },
  { value: "Pickleball", label: "🎾 Pickleball" },
  { value: "Badminton", label: "🏸 Badminton" },
  { value: "Tennis", label: "🎾 Tennis" },
  { value: "Other", label: "➕ Other" },
];

const inputBaseClasses =
  "bg-bg3 border rounded-r text-ink font-body text-[14.5px] px-[13px] py-3 w-full outline-none transition-colors duration-200 focus:border-accent";
const labelClasses =
  "text-[11px] font-bold text-muted tracking-[0.5px] uppercase";

function fieldClasses(hasError) {
  return `${inputBaseClasses} ${hasError ? "border-red-500" : "border-white/10"}`;
}

export default function PlayerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [otp, setOtp] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [selectedCountryIso, setSelectedCountryIso] = useState("in");
  const [city, setCity] = useState("Indore");
  const [sport, setSport] = useState("");
  const [referral, setReferral] = useState("");

  const [cityOptions, setCityOptions] = useState(DEFAULT_CITIES);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const cityRequestIdRef = useRef(0);

  const [toast, setToast] = useState({ show: false, title: "", message: "" });
  const toastTimerRef = useRef(null);

  function notify(title, message) {
    setToast({ show: true, title, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      3800
    );
  }

  const fetchCitiesForCountry = async (countryName) => {
    if (!countryName) return;
    const requestId = ++cityRequestIdRef.current;
    setCitiesLoading(true);
    const applyFallback = () => {
      if (requestId !== cityRequestIdRef.current) return;
      setCityOptions(DEFAULT_CITIES);
    };
    try {
      const res = await fetch(
        `https://countriesnow.space/api/v0.1/countries/cities/q?country=${encodeURIComponent(countryName)}`
      );
      const data = await res.json();
      if (requestId !== cityRequestIdRef.current) return; // a newer request superseded this one
      const cities = !data.error && Array.isArray(data.data) ? data.data : [];
      if (cities.length) {
        setCityOptions(cities);
      } else {
        applyFallback();
      }
    } catch {
      applyFallback();
    } finally {
      if (requestId === cityRequestIdRef.current) setCitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchCitiesForCountry("India");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearError(name) {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handlePhoneChange(value, country) {
    const dialCode = country?.dialCode || "91";
    setCountryCode(`+${dialCode}`);
    setPhone(value.slice(dialCode.length));
    clearError("phone");
    if (country?.countryCode && country.countryCode !== selectedCountryIso) {
      setSelectedCountryIso(country.countryCode);
      setCity("");
      fetchCitiesForCountry(country.name);
    }
  }

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    if (!city) e.city = "City is required";
    if (!sport) e.sports = "Please select a sport";
    if (referral.trim() && referral.trim().length !== 8)
      e.referral = "Referral code must be 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignupSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        mobile: phone,
        country_code: countryCode,
        type: "signup",
        first_name: firstName,
        last_name: lastName,
        city,
        primary_sport: sport.toLowerCase(),
        referral_code: referral || undefined,
      };
      const res = await authApi.signup(payload);
      const data = res.data?.data || res.data;
      const token = data?.token || data?.access_token;
      if (token) {
        setSubmitted(true);
      } else {
        if (data?.otp) setOtp(String(data.otp));
        setStep("otp");
      }
    } catch (err) {
      notify(
        "Registration failed",
        err.response?.data?.message || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.trim().length !== 6) {
      setErrors({ otp: "Please enter all 6 digits" });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, otp, "signup");
      const data = res.data?.data || res.data;
      const token = data?.token || data?.access_token;
      if (token) {
        setSubmitted(true);
      } else {
        notify("Verification failed", "Invalid OTP. Please try again.");
      }
    } catch (err) {
      notify(
        "Verification failed",
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    if (step === "otp") {
      handleVerifyOtp();
    } else {
      handleSignupSubmit();
    }
  }

  if (submitted) {
    return (
      <SuccessView
        title="You're on the list!"
        message="Thanks for registering with TurfNext. We'll notify you the moment we go live in your city — get ready to play."
      />
    );
  }

  return (
    <>
      <div className="mb-[26px] text-center">
        <div
          className="w-[50px] h-[50px] rounded-xl bg-accent/[0.08] border border-accent/[0.19] flex items-center justify-center text-[22px] mx-auto mb-4"
          aria-hidden="true"
        >
          🏃
        </div>
        <h1 className="font-display font-black text-[clamp(22px,4vw,28px)] tracking-[-0.5px] mb-2">
          Player Registration
        </h1>
        <p className="text-muted text-[13.5px] max-w-[400px] mx-auto leading-[1.6]">
          Be first in line when TurfNext goes live in your city.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {step === "form" && (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 text-left">
            <label className={labelClasses} htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Rahul"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                clearError("firstName");
              }}
              className={fieldClasses(!!errors.firstName)}
            />
            {errors.firstName && (
              <div className="text-red-500 text-[11px] mt-[3px]">{errors.firstName}</div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <label className={labelClasses} htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Sharma"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearError("lastName");
              }}
              className={fieldClasses(!!errors.lastName)}
            />
            {errors.lastName && (
              <div className="text-red-500 text-[11px] mt-[3px]">{errors.lastName}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className={labelClasses} htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            country={"in"}
            enableSearch
            value={`${countryCode.replace("+", "")}${phone}`}
            onChange={handlePhoneChange}
            inputProps={{ id: "phone", name: "phone" }}
            containerStyle={{ width: "100%" }}
            inputStyle={{
              width: "100%",
              height: 46,
              background: "#1A1A1A",
              border: `1px solid ${errors.phone ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "8px",
              color: "#F0F0F0",
              fontSize: 14.5,
            }}
            buttonStyle={{
              background: "#1A1A1A",
              border: `1px solid ${errors.phone ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "8px 0 0 8px",
            }}
            dropdownStyle={{
              background: "#111111",
              color: "#F0F0F0",
            }}
            searchStyle={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F0F0F0",
            }}
          />
          {errors.phone && (
            <div className="text-red-500 text-[11px] mt-[3px]">{errors.phone}</div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className={labelClasses} htmlFor="city">
            City <span className="text-red-500">*</span>
          </label>
          <CustomSelect
            options={cityOptions}
            value={city}
            onChange={(v) => {
              setCity(v);
              clearError("city");
            }}
            disabled={citiesLoading}
            hasError={!!errors.city}
            loadingText="Loading cities..."
            placeholder="Select City"
            searchPlaceholder="Search city..."
          />
          {errors.city && (
            <div className="text-red-500 text-[11px] mt-[3px]">{errors.city}</div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className={labelClasses}>
            Primary Sport <span className="text-red-500">*</span>
          </label>
          <RadioChipGroup
            options={SPORTS}
            name="sports"
            onChange={(v) => {
              setSport(v);
              clearError("sports");
            }}
          />
          {errors.sports && (
            <div className="text-red-500 text-[11px] mt-[3px]">{errors.sports}</div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className={labelClasses} htmlFor="referral">
            Referral Code{" "}
            <span className="text-[11px] text-muted2 normal-case font-medium tracking-normal">
              (optional)
            </span>
          </label>
          <input
            id="referral"
            name="referral"
            type="text"
            placeholder="e.g. RAHUL100"
            value={referral}
            onChange={(e) => {
              setReferral(e.target.value);
              clearError("referral");
            }}
            className={fieldClasses(!!errors.referral)}
          />
          {errors.referral && (
            <div className="text-red-500 text-[11px] mt-[3px]">{errors.referral}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-1.5 px-[26px] py-[15px] rounded-r text-[15px] font-bold bg-accent text-black transition-all duration-200 hover:bg-accent2 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(200,255,0,0.19)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? "Please wait..." : "Submit Registration"}
        </button>
        </>
      )}

      {step === "otp" && (
        <>
          <div className="text-muted text-[13.5px] text-center">
            OTP sent to <strong className="text-ink">{countryCode} {phone}</strong>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <label className={labelClasses}>Enter OTP</label>
            <OtpInput
              value={otp}
              onChange={(v) => {
                setOtp(v);
                clearError("otp");
              }}
              length={6}
              hasError={!!errors.otp}
            />
            {errors.otp && (
              <div className="text-red-500 text-[11px] mt-[3px]">{errors.otp}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1.5 px-[26px] py-[15px] rounded-r text-[15px] font-bold bg-accent text-black transition-all duration-200 hover:bg-accent2 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(200,255,0,0.19)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
          <button
            type="button"
            onClick={() => setStep("form")}
            className="w-full px-[26px] py-3 rounded-r text-[14px] font-bold bg-transparent text-ink border border-white/10 transition-all duration-200 hover:border-accent hover:text-accent"
          >
            ← Back
          </button>
        </>
      )}
      </form>

      <Toast show={toast.show} title={toast.title} message={toast.message} variant="error" />
    </>
  );
}
