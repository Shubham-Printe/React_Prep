import { useEffect, useState } from "react"
import { fetchProfile } from "./data-fetchers/dataFetcher"

export default function SuspenseDataFetchingDemo() {

    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        setIsLoading(true);
        fetchProfile(2000, false).then((profile) => {
            console.log(profile);
            setProfile(profile);
        }).catch((error) => {
            console.log(error);
            setError(error);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    return (
        <div style={{ display: 'grid', gap: 12 }}>
            <h3 style={{ margin: 0 }}>Mock async fetch (no Suspense yet)</h3>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {(profile && !isLoading && !error) && (
                <div
                    style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: 16,
                        background: 'white',
                        display: 'grid',
                        gap: 6,
                    }}
                >
                    <div>
                        <strong>Name:</strong> {profile.name}
                    </div>
                    <div>
                        <strong>Email:</strong> {profile.email}
                    </div>
                    <div>
                        <strong>Designation:</strong> {profile.designation}
                    </div>
                </div>
            )}
        </div>
    )
}
