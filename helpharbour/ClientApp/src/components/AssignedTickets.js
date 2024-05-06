import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import


const AssignedTickets = () => {
const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('api/tickets/assigned');
            const data = await response.json();
            setTickets(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Assigned Tickets</h1>
            {loading ? <p><em>Loading...</em></p> : renderTicketsTable(tickets)}
        </div>
    );
};

