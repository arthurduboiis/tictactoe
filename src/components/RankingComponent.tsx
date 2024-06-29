import React, { useEffect, useState } from "react";
import axios from "axios";

const RankingComponent: React.FC = () => {
    const [ranking, setRanking] = useState<any[]>([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + "api/ranking");
                setRanking(response.data);
            } catch (error) {
                console.error("There was an error fetching the ranking!", error);
            }
        };

        fetchRanking();
    }, []);

    return (
        <div style={{ textAlign: "center", padding: '20px'}}>
            <h2 style={{ marginBottom: '20px' }}>Classement</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd', color: '#333', fontWeight: 'bold' }}>Nom</th>
                        <th style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd', color: '#333', fontWeight: 'bold' }}>Gagnés</th>
                        <th style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd', color: '#333', fontWeight: 'bold' }}>Perdus</th>
                        <th style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd', color: '#333', fontWeight: 'bold' }}>Match nul</th>
                        <th style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd', color: '#333', fontWeight: 'bold' }}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.map((rank) => (
                        <tr key={rank.userID} style={{ backgroundColor: (rank.userID % 2 === 0) ? '#f9f9f9' : '#ffffff' }}>
                            <td style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{rank.username}</td>
                            <td style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{rank.win}</td>
                            <td style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{rank.lose}</td>
                            <td style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{rank.equal}</td>
                            <td style={{ padding: '12px 15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{rank.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RankingComponent;
