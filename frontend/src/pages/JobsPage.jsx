import { useState, useEffect } from 'react';
import { get } from '../utils/ClientApi.js';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        get('/jobs')
            .then(data => {
                setJobs(data.postings || []);
            })
            .catch(err => {
                setError(err.message || 'Failed to fetch jobs');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <main style={{ padding: '2rem' }}>
            <h1>Open Job Positions</h1>

            {loading && <p>Loading jobs...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <div>
                {jobs.map(job => (
                    <div
                        key={job.id}
                        style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
                    >
                        <h2>{job.brief}</h2>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default JobsPage;
