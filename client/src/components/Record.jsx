import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    sponsor: "",
    major: "",
    institution: "",
    image: null, // Image field
  });
  const [preview, setPreview] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.id) return;

    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:5050/record/${params.id}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const record = await response.json();
        if (!record) return navigate("/");

        setForm(record);
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
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("sponsor", form.sponsor);
    formData.append("major", form.major);
    formData.append("institution", form.institution);
    if (form.image) formData.append("image", form.image); // Append image file

    try {
      let response;
      if (!params.id) {
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          body: formData, // Send formData instead of JSON
        });
      } else {
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          body: formData,
        });
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error("A problem occurred:", error);
    } finally {
      setForm({ name: "", email: "", sponsor: "", major: "", institution: "", image: null });
      setPreview(null);
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Scholar Record</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4" encType="multipart/form-data">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">Scholar Info</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly, so be careful what you share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            {/* Name Input */}
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full border rounded-md p-2"
                placeholder="First Last"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
              />
            </div>

            {/* Email Input */}
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full border rounded-md p-2"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => updateForm({ email: e.target.value })}
              />
            </div>

            {/* Sponsor Input */}
            <div className="sm:col-span-4">
              <label htmlFor="sponsor" className="block text-sm font-medium leading-6 text-slate-900">Sponsor</label>
              <input
                type="text"
                name="sponsor"
                id="sponsor"
                className="block w-full border rounded-md p-2"
                value={form.sponsor}
                onChange={(e) => updateForm({ sponsor: e.target.value })}
              />
            </div>

            {/* Major Input */}
            <div className="sm:col-span-4">
              <label htmlFor="major" className="block text-sm font-medium leading-6 text-slate-900">Major</label>
              <input
                type="text"
                name="major"
                id="major"
                className="block w-full border rounded-md p-2"
                value={form.major}
                onChange={(e) => updateForm({ major: e.target.value })}
              />
            </div>

            {/* Institution Input */}
            <div className="sm:col-span-4">
              <label htmlFor="institution" className="block text-sm font-medium leading-6 text-slate-900">Institution</label>
              <input
                type="text"
                name="institution"
                id="institution"
                className="block w-full border rounded-md p-2"
                value={form.institution}
                onChange={(e) => updateForm({ institution: e.target.value })}
              />
            </div>

            {/* Image Upload Field */}
            <div className="sm:col-span-4">
              <label htmlFor="image" className="block text-sm font-medium leading-6 text-slate-900">Upload Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="block w-full border rounded-md p-2"
                onChange={handleImageChange}
              />
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-md" />
                </div>
              )}
            </div>
          </div>
        </div>
        <input type="submit" value="Save Scholar Record" className="mt-4 p-2 border rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300" />
      </form>
    </>
  );
}
