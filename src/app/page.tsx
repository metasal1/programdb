'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "react-loader-spinner";
import Register from "./components/Register";

export default function Home() {

  const [domain, setDomain] = useState("");
  const [domainOwner, setDomainOwner] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subdomains, setSubdomains] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/subdomains', {
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => {
        setSubdomains(data);
      });
    setLoading(false);
  }
    , []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('This program name is not registered');
      }
      const data = await response.json();
      setDomainOwner(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDomain('');
    setDomainOwner('');
    setError(null);
  };

  const handleProgramClick = (subdomain: any) => {
    setDomain(subdomain.target.innerText);
    setDomainOwner('')
  }

  return (
    <>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Solana Program Database</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter program name to resolve"
            className="border p-2 mr-2 w-1/2 vw-50"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 mr-2"
            disabled={loading}
          >
            {/* {loading ? 'Loading...' : 'Get Owner'} */}
            Find Program
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-500 text-white p-2 "
          >
            Clear
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <Register />

        {domain && domainOwner && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Address: {domainOwner}</h2>
          </div>
        )}
        {loading &&
          <ProgressBar
            visible={true}
            height="80"
            width="80"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        }
        {subdomains.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Registered Programs: {subdomains.length}</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subdomains.map((subdomain: any) => (
                <li key={subdomain} className="break-all cursor-pointer" onClick={handleProgramClick}>
                  {subdomain}
                </li>
              ))}
            </ul>
          </div>
        )}
        <footer className="text-xs p-5">Made by <Link className="text-red-500" target="_blank" href={"https://www.metasal.xyz"}>@metasal</Link></footer>
      </main>
    </>
  );
}
