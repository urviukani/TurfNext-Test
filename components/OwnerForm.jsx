"use client";

import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ChipGroup from "./ChipGroup";
import CustomSelect from "./CustomSelect";
import RadioChipGroup from "./RadioChipGroup";
import SuccessView from "./SuccessView";
import Toast from "./Toast";
import { ownerApi } from "@/lib/api/owner";

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

const VENUE_TYPES = [
  { value: "Covered", label: "Covered" },
  { value: "Uncovered", label: "Uncovered" },
  { value: "Partially Covered", label: "Partially Covered" },
];

const DEFAULT_MAP_QUERY = "Indore, Madhya Pradesh";

function mapSrcFor(query, zoom = 12) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    query
  )}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
}

const inputBaseClasses =
  "bg-bg3 border rounded-r text-ink font-body text-[clamp(12px,1.7vh,13.5px)] px-3 py-[clamp(6px,1.1vh,9px)] w-full outline-none transition-colors duration-200 focus:border-accent";
const labelClasses =
  "text-[9.5px] font-bold text-muted tracking-[0.5px] uppercase";

function fieldClasses(hasError) {
  return `${inputBaseClasses} ${hasError ? "border-red-500" : "border-white/10"}`;
}

export default function OwnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [venueName, setVenueName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [selectedCountryIso, setSelectedCountryIso] = useState("in");
  const [altCountryCode, setAltCountryCode] = useState("+91");
  const [altPhone, setAltPhone] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("Indore");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");
  const [sports, setSports] = useState([]);
  const [venueType, setVenueType] = useState("");

  const [cityOptions, setCityOptions] = useState(DEFAULT_CITIES);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const cityRequestIdRef = useRef(0);

  const [mapSrc, setMapSrc] = useState(mapSrcFor(DEFAULT_MAP_QUERY));
  const [mapStatus, setMapStatus] = useState(
    "Map updates as you type your location above"
  );
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const debounceRef = useRef(null);

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

  function clearError(name) {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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

  function handlePrimaryPhoneChange(value, country) {
    const dialCode = country?.dialCode || "91";
    setCountryCode(`+${dialCode}`);
    setPrimaryPhone(value.slice(dialCode.length));
    clearError("primaryPhone");
    if (country?.countryCode && country.countryCode !== selectedCountryIso) {
      setSelectedCountryIso(country.countryCode);
      setCity("");
      clearError("city");
      fetchCitiesForCountry(country.name);
    }
  }

  function handleAltPhoneChange(value, country) {
    const dialCode = country?.dialCode || "91";
    setAltCountryCode(`+${dialCode}`);
    setAltPhone(value.slice(dialCode.length));
    clearError("altPhone");
  }

  function validate() {
    const e = {};
    if (!venueName.trim()) e.venueName = "Venue name is required";
    if (!contactPerson.trim()) e.contactPerson = "Contact person is required";
    if (!primaryPhone.trim()) e.primaryPhone = "Phone number is required";
    if (!location.trim()) e.location = "Location / area is required";
    if (!city) e.city = "City is required";
    if (!landmark.trim()) e.landmark = "Nearest landmark is required";
    if (!coords.lat || !coords.lng)
      e.coords = "Please pin your venue using \"Use My Current Location\"";
    if (sports.length === 0) e.sports = "Please select at least one game";
    if (!venueType) e.venueType = "Please select a venue type";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: venueName,
        contact_person: contactPerson,
        description: description || undefined,
        sports: sports.map((s) => s.toLowerCase()),
        address: location,
        city,
        landmark,
        latitude: coords.lat,
        longitude: coords.lng,
        venue_type: venueType,
        mobile: primaryPhone,
        alt_mobile: altPhone || undefined,
        country_code: countryCode.replace("+", ""),
        alt_country_code: altPhone ? altCountryCode.replace("+", "") : undefined,
      };
      await ownerApi.createTurfRequest(payload);
      setSubmitted(true);
    } catch (err) {
      notify(
        "Submission failed",
        err.response?.data?.message || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateMapFromText(value) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setMapStatus("Updating map…");
    debounceRef.current = setTimeout(() => {
      const q = value && value.trim().length > 2 ? value.trim() : DEFAULT_MAP_QUERY;
      setMapSrc(mapSrcFor(q, 14));
      setMapStatus(`Map updated for: ${q}`);
    }, 700);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setMapStatus("Geolocation is not supported on this browser.");
      return;
    }
    setMapStatus("Fetching your current location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        clearError("coords");
        setMapSrc(mapSrcFor(`${lat},${lng}`, 16));
        setMapStatus(`Location captured: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      },
      () => {
        setMapStatus(
          "Could not access your location. Please allow location access, or type it above."
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  if (submitted) {
    return (
      <SuccessView
        title="Venue submitted!"
        message="Thanks for your interest in partnering with TurfNext. Our onboarding team will reach out shortly to complete your venue listing."
      />
    );
  }

  return (
    <>
      <div className="mb-[clamp(6px,1.6vh,16px)] text-center">
        <div
          className="w-[clamp(28px,5vh,40px)] h-[clamp(28px,5vh,40px)] rounded-xl bg-accent/[0.08] border border-accent/[0.19] flex items-center justify-center text-[clamp(14px,2.2vh,18px)] mx-auto mb-[clamp(4px,1vh,10px)]"
          aria-hidden="true"
        >
          🏟️
        </div>
        <h1 className="font-display font-black text-[clamp(16px,2.6vh,23px)] mb-0.5">
          List Your Turf
        </h1>
        <p className="text-muted text-[clamp(10.5px,1.6vh,12.5px)] leading-[1.4] max-w-[400px] mx-auto">
          Partner with TurfNext and fill your slots faster.
        </p>
      </div>

      <form
        className="flex flex-col gap-[clamp(6px,1.4vh,11px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5 text-left">
            <label className={labelClasses} htmlFor="venueName">
              Venue Name <span className="text-red-500">*</span>
            </label>
            <input
              id="venueName"
              name="venueName"
              type="text"
              placeholder="e.g. Champions Turf Arena"
              value={venueName}
              onChange={(e) => {
                setVenueName(e.target.value);
                clearError("venueName");
              }}
              className={fieldClasses(!!errors.venueName)}
            />
            {errors.venueName && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.venueName}</div>
            )}
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <label className={labelClasses} htmlFor="contactPerson">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              id="contactPerson"
              name="contactPerson"
              type="text"
              placeholder="Owner / Manager name"
              value={contactPerson}
              onChange={(e) => {
                setContactPerson(e.target.value);
                clearError("contactPerson");
              }}
              className={fieldClasses(!!errors.contactPerson)}
            />
            {errors.contactPerson && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.contactPerson}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5 text-left">
            <label className={labelClasses} htmlFor="primaryPhone">
              Primary Mobile Number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              country={"in"}
              enableSearch
              value={`${countryCode.replace("+", "")}${primaryPhone}`}
              onChange={handlePrimaryPhoneChange}
              inputProps={{ id: "primaryPhone", name: "primaryPhone" }}
              containerStyle={{ width: "100%" }}
              inputStyle={{
                width: "100%",
                height: "clamp(30px,4.4vh,38px)",
                background: "#1A1A1A",
                border: `1px solid ${errors.primaryPhone ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "8px",
                color: "#F0F0F0",
                fontSize: "clamp(12px,1.7vh,13.5px)",
              }}
              buttonStyle={{
                background: "#1A1A1A",
                border: `1px solid ${errors.primaryPhone ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "8px 0 0 8px",
              }}
              dropdownStyle={{ background: "#111111", color: "#F0F0F0" }}
              searchStyle={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F0F0F0",
              }}
            />
            {errors.primaryPhone && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.primaryPhone}</div>
            )}
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <label className={labelClasses} htmlFor="altPhone">
              Alternate Number{" "}
              <span className="normal-case font-medium tracking-normal text-muted2">
                (optional)
              </span>
            </label>
            <PhoneInput
              country={"in"}
              enableSearch
              value={`${altCountryCode.replace("+", "")}${altPhone}`}
              onChange={handleAltPhoneChange}
              inputProps={{ id: "altPhone", name: "altPhone" }}
              containerStyle={{ width: "100%" }}
              inputStyle={{
                width: "100%",
                height: "clamp(30px,4.4vh,38px)",
                background: "#1A1A1A",
                border: `1px solid ${errors.altPhone ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "8px",
                color: "#F0F0F0",
                fontSize: "clamp(12px,1.7vh,13.5px)",
              }}
              buttonStyle={{
                background: "#1A1A1A",
                border: `1px solid ${errors.altPhone ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "8px 0 0 8px",
              }}
              dropdownStyle={{ background: "#111111", color: "#F0F0F0" }}
              searchStyle={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F0F0F0",
              }}
            />
            {errors.altPhone && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.altPhone}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5 text-left">
            <label className={labelClasses} htmlFor="location">
              Location / Area <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Vijay Nagar, Indore"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                clearError("location");
                updateMapFromText(e.target.value);
              }}
              className={fieldClasses(!!errors.location)}
            />
            {errors.location && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.location}</div>
            )}
          </div>
          <div className="flex flex-col gap-0.5 text-left">
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
              compact
            />
            {errors.city && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.city}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-0.5 text-left">
          <label className={labelClasses} htmlFor="landmark">
            Nearest Landmark <span className="text-red-500">*</span>
          </label>
          <input
            id="landmark"
            name="landmark"
            type="text"
            placeholder="e.g. Near C21 Mall"
            value={landmark}
            onChange={(e) => {
              setLandmark(e.target.value);
              clearError("landmark");
            }}
            className={fieldClasses(!!errors.landmark)}
          />
          {errors.landmark && (
            <div className="text-red-500 text-[10.5px] mt-0.5">{errors.landmark}</div>
          )}
        </div>

        <div className="flex flex-col gap-0.5 text-left">
          <label className={labelClasses}>
            Pin Your Venue on the Map <span className="text-red-500">*</span>
          </label>
          <div
            className={`border rounded-r2 overflow-hidden bg-bg3 relative ${
              errors.coords ? "border-red-500" : "border-white/10"
            }`}
          >
            <iframe
              title="Venue location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
              className="map-iframe w-full h-[clamp(60px,11vh,130px)] border-0 block"
            />
          </div>
          <div className="flex gap-1.5 mt-1 flex-wrap items-center">
            <button
              type="button"
              onClick={useCurrentLocation}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent bg-accent/[0.08] border border-accent/[0.19] px-[13px] py-[7px] rounded-full transition-colors duration-200 hover:bg-accent/20"
            >
              📍 Use My Current Location
            </button>
            <span className="text-[11.5px] text-muted2" aria-live="polite">
              {mapStatus}
            </span>
          </div>
          {errors.coords && (
            <div className="text-red-500 text-[10.5px] mt-0.5">{errors.coords}</div>
          )}
          <input type="hidden" name="lat" value={coords.lat} />
          <input type="hidden" name="lng" value={coords.lng} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5 text-left">
            <label className={labelClasses}>
              Games Offered <span className="text-red-500">*</span>{" "}
              <span className="normal-case font-medium tracking-normal text-muted2">
                (select all)
              </span>
            </label>
            <ChipGroup
              options={SPORTS}
              name="sports"
              compact
              onChange={(next) => {
                setSports(next);
                clearError("sports");
              }}
            />
            {errors.sports && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.sports}</div>
            )}
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <label className={labelClasses}>
              Venue Type <span className="text-red-500">*</span>
            </label>
            <RadioChipGroup
              options={VENUE_TYPES}
              name="venueType"
              compact
              onChange={(v) => {
                setVenueType(v);
                clearError("venueType");
              }}
            />
            {errors.venueType && (
              <div className="text-red-500 text-[10.5px] mt-0.5">{errors.venueType}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-0.5 text-left">
          <label className={labelClasses} htmlFor="description">
            Description{" "}
            <span className="normal-case font-medium tracking-normal text-muted2">
              (optional)
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            placeholder="Tell us a bit about your venue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={fieldClasses(false) + " resize-y"}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-0.5 px-[26px] py-[clamp(9px,1.6vh,13px)] rounded-r text-[13.5px] font-bold bg-accent text-black transition-all duration-200 hover:bg-accent2 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(200,255,0,0.19)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? "Submitting..." : "Submit Venue Details"}
        </button>
      </form>

      <Toast show={toast.show} title={toast.title} message={toast.message} variant="error" />
    </>
  );
}
