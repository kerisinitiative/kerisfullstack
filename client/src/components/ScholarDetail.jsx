import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import placeholderImg from "../assets/img/imgplaceholder.jpg";
import DOMPurify from 'dompurify'; // For XSS protection

const ScholarDetail = () => {
  const { id } = useParams();
  const [scholar, setScholar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScholar() {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/record/${id}`);
        if (!response.ok) throw new Error("Scholar not found");
        const data = await response.json();
        setScholar(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchScholar();
  }, [id]);

  // Safe HTML render function
  const renderHTML = (html) => {
    if (!html) return "No details provided.";
    const cleanHTML = DOMPurify.sanitize(html);
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
  };

  if (loading)
    return (
      <div className="text-center min-h-screen m-10">
        <strong>Loading...</strong>
      </div>
    );
  if (!scholar)
    return (
      <div className="text-center m-10 min-h-screen text-[--color-primary]">
        <strong>Scholar not found :/ </strong>
        <div className="text-center m-6 text-white">
          <Link to="/scholar" className="bg-[--color-primary] hover:bg-[--color-light] hover:text-[--color-secondary] px-4 py-2 rounded-md">
            Back to Scholars List
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="h-96 flex items-center justify-center text-center text-white relative"
        style={{
          backgroundImage: `url(${scholar.image || placeholderImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl text-[--color-light] font-bold">
            {scholar.name}
          </h1>
          {scholar.sponsor && (
            <p className="text-xl text-[--color-light] mb-2">
              {scholar.sponsor} Scholar
            </p>
          )}
          <p className="text-md text-[--color-light]">
                {scholar.availability === true
                ? "Available for Mentorship: ✅" // if available
                : scholar.availability === false
                ? "Unavailable for Mentorship: ❌" // if unavailable
                : "Invalid: ❓" // if null or invalid 
                }
          </p>
        </div>
      </div>

      {/* Scholar Information Grid */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Scholar Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Sponsor</h3>
                <p>{scholar.sponsor || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                <p>
                  {scholar.email ? (
                    <a href={`mailto:${scholar.email}`} className="text-blue-600 hover:underline">
                      {scholar.email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Institution(s)</h3>
                <p>
                  {scholar.institution?.length > 0 ? (
                    scholar.institution.join(", ")
                  ) : (
                    "Not specified"
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Major(s)</h3>
                <p>
                  {scholar.major?.length > 0 ? (
                    scholar.major.join(", ")
                  ) : (
                    "Undeclared"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Scholar Section */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">About {scholar.name}</h2>
        {renderHTML(scholar.about)}
      </div>

      {/* Social Media & Contact */}
      {scholar.ig_acc && (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
          <h2 className="text-2xl font-semibold mb-4">Connect</h2>
          <div className="flex items-center space-x-4">
            <a 
              href={`https://instagram.com/${scholar.ig_acc.replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800"
            >
              <span className="sr-only">Instagram</span>
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                {scholar.ig_acc}
              </span>
            </a>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Link to="/scholar" className="inline-block bg-[--color-primary] hover:bg-[--color-light] hover:text-[--color-secondary] px-6 py-3 rounded-md text-white font-medium">
          Back to Scholars List
        </Link>
      </div>
    </div>
  );
};

export default ScholarDetail;