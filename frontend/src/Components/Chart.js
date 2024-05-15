import React, {useEffect, useState} from 'react';
import { Pie } from 'react-chartjs-2';
// Import the required components from Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CreditCard from "../Model/card";
import {authFetch} from "../Utils/autoFetch";

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend);

const API_GET_ALL_URL = 'http://localhost:8000/api/v1/credit-cards';
const API_SOCKET_UPDATER = 'ws://localhost:8080';
const PieChart = () => {

    const [localCards, setLocalCards] = useState([]);

    useEffect(() => {
        fetchAllCards();
    }, []);

    useEffect(() => {
        const socket = new WebSocket(API_SOCKET_UPDATER);

        socket.addEventListener('message', function (event) {
            if (event.data === 'update') {
                // Fetch the updated data from the backend
                console.log('Data updated, fetch new data here');

                fetchAllCards();
            }
        });

        // Cleanup on component unmount
        return () => socket.close();
    }, []);

    const fetchAllCards = async () => {
        authFetch(API_GET_ALL_URL)
            .then(response => response.json())
            .then(data => {
                const cards = data.cards.map(card => new CreditCard(card));
                setLocalCards(cards);
                console.log(cards);
            })
            .catch(error => {
                console.error(error);
                setLocalCards([]);
            });
    }


    const backgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
    ]

    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
    ];

    const getDynamicColors = (count, usedColors) => {
        let colors = [];
        for (let i = 0; i < count; i++) {
            // Cycle through baseColors and push into colors array
            colors.push(usedColors[i % usedColors.length]);
        }
        return colors;
    }

    const getUniqueYears = () => {
        const years = [];
        localCards.forEach(card => {
            const year = card.expiryYr;
            if (!years.includes(year)) {
                years.push(year);
            }
        });
        console.log(years);
        return years;
    }

    const getUniqueYearsFrequency = () => {
        const years = getUniqueYears();
        const frequency = [];
        years.forEach(() => {
            frequency.push(0);
        });
        localCards.forEach(card => {
            const year = card.expiryYr;
            const indexYear = years.indexOf(year);
            frequency[indexYear] += 1;
        });
        console.log(frequency);
        console.log(Object.values(frequency));
        // return only the values list
        return Object.values(frequency)
    }
    const dataCount = getUniqueYearsFrequency().length;

    const data = {
        labels: getUniqueYears(),
        datasets: [{
            label: '# of Cards',
            data: getUniqueYearsFrequency(),
            backgroundColor: getDynamicColors(dataCount, backgroundColors),
            borderColor: getDynamicColors(dataCount, borderColors),
            borderWidth: 1,
        }],    };

    return <div style={{ width: '400px', height: '400px' }}>
        <Pie data={data} />
    </div>;
};

export default PieChart;
