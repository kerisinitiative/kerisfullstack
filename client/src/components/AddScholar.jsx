import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import RichTextEditor from "./RichTextEditor";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    ig_acc: "", // Now optional
    about: "<p></p>",
    sponsor: "",
    major: "",
    institution: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.id) return;

    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:5050/record/${params.id}`
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const record = await response.json();
        if (!record) return navigate("/");

        setForm({
          ...record,
          about: record.about || "<p></p>",
          major: Array.isArray(record.major) ? record.major.join(", ") : record.major,
          institution: Array.isArray(record.institution) ? record.institution.join(", ") : record.institution
        });
        if (record.image) {
          setPreview(`http://localhost:5050/uploads/${record.image}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  }

  function validateForm() {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (form.about === "<p></p>" || !form.about.trim()) newErrors.about = "About section is required";
    if (!form.sponsor.trim()) newErrors.sponsor = "Sponsor is required";
    if (!form.major.trim()) newErrors.major = "Major is required";
    if (!form.institution.trim()) newErrors.institution = "Institution is required";
    if (!form.image && !params.id) newErrors.image = "Image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const majors = form.major
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const institutions = form.institution
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      // Instagram is optional, only append if it has value
      if (form.ig_acc.trim()) formData.append("ig_acc", form.ig_acc);
      formData.append("about", form.about);
      formData.append("sponsor", form.sponsor);

      majors.forEach((major) => formData.append("major[]", major));
      institutions.forEach((institution) =>
        formData.append("institution[]", institution)
      );

      if (form.image) formData.append("image", form.image);

      let response;
      if (!params.id) {
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setForm({
        name: "",
        email: "",
        ig_acc: "",
        about: "<p></p>",
        sponsor: "",
        major: "",
        institution: "",
        image: null,
      });
      setPreview(null);
      navigate("/admin/scholar-list");
    } catch (error) {
      console.error("A problem occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <div className="min-h-full p-4 sm:p-10">
      <h3 className="text-lg font-semibold p-4">
        {params.id ? "Edit" : "Create"} Scholar Record
      </h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Scholar Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly, so be careful what
              you share.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8">
            {/* Name Input */}
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name*
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className={`block w-full border rounded-md p-2 ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="First Last"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Email*
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`block w-full border rounded-md p-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => updateForm({ email: e.target.value })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Instagram Account - Now optional */}
            <div className="sm:col-span-4">
              <label
                htmlFor="ig_acc"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Instagram Account
              </label>
              <input
                type="text"
                name="ig_acc"
                id="ig_acc"
                className="block w-full border rounded-md p-2"
                value={form.ig_acc}
                onChange={(e) => updateForm({ ig_acc: e.target.value })}
              />
              {/* No error message since it's optional */}
            </div>

            {/* About */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About*
              </label>
              <RichTextEditor
                value={form.about}
                onChange={(html) => updateForm({ about: html })}
              />
              {errors.about && (
                <p className="mt-1 text-sm text-red-600">{errors.about}</p>
              )}
            </div>

            {/* Sponsor */}
            <div className="sm:col-span-4">
              <label
                htmlFor="sponsor"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Sponsor*
              </label>
              <input
                type="text"
                name="sponsor"
                id="sponsor"
                className={`block w-full border rounded-md p-2 ${
                  errors.sponsor ? "border-red-500" : ""
                }`}
                value={form.sponsor}
                onChange={(e) => updateForm({ sponsor: e.target.value })}
              />
              {errors.sponsor && (
                <p className="mt-1 text-sm text-red-600">{errors.sponsor}</p>
              )}
            </div>

            {/* Major */}
            <div className="sm:col-span-4">
              <label
                htmlFor="major"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Major*
              </label>
              <input
                type="text"
                name="major"
                id="major"
                className={`block w-full border rounded-md p-2 ${
                  errors.major ? "border-red-500" : ""
                }`}
                placeholder="e.g., Computer Science, Mathematics"
                value={form.major}
                onChange={(e) => updateForm({ major: e.target.value })}
              />
              <p className="text-sm text-slate-500">
                Separate multiple majors with commas
              </p>
              {errors.major && (
                <p className="mt-1 text-sm text-red-600">{errors.major}</p>
              )}
            </div>

            {/* Institution */}
            <div className="sm:col-span-4">
              <label
                htmlFor="institution"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Institution*
              </label>
              <input
                type="text"
                name="institution"
                id="institution"
                className={`block w-full border rounded-md p-2 ${
                  errors.institution ? "border-red-500" : ""
                }`}
                placeholder="e.g., UCSD"
                value={form.institution}
                onChange={(e) => updateForm({ institution: e.target.value })}
              />
              <p className="text-sm text-slate-500">
                Separate multiple institutions with commas
              </p>
              {errors.institution && (
                <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
              )}
            </div>

            {/* Image Upload Field */}
            <div className="sm:col-span-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                {params.id ? "Update Image" : "Upload Image*"}
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className={`block w-full border rounded-md p-2 ${
                  errors.image ? "border-red-500" : ""
                }`}
                onChange={handleImageChange}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <input
          type="submit"
          value={isSubmitting ? "Submitting..." : "Save Scholar Record"}
          className={`mt-4 p-2 border rounded-md cursor-pointer ${
            isSubmitting
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-slate-200 hover:bg-slate-300"
          }`}
          disabled={isSubmitting}
        />
        <NavLink to="/admin/scholar-list">
          <a className="mt-4 mx-2 p-2 border rounded-md cursor-pointer bg-[--color-primary] hover:bg-[--color-secondary] hover:text-[--color-light]">Cancel</a>
        </NavLink>
      </form>
    </div>
    </>
  );
}