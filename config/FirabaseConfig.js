// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "pet-adopt-63663.firebaseapp.com",
    projectId: "pet-adopt-63663",
    storageBucket: "pet-adopt-63663.appspot.com",
    messagingSenderId: "738692540551",
    appId: "1:738692540551:web:2953095d6cdacf75443022"
};

// Log Firebase configuration for debugging (without sensitive keys)
console.log("Firebase Config (Project ID):", firebaseConfig.projectId);
console.log("Firebase API Key available:", !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY);

// Initialize Firebase
let db;
try {
    console.log("Initializing Firebase app...");
    const app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully!");
    db = getFirestore(app);
} catch (error) {
    console.error("Error initializing Firebase:", error);
    // Create a dummy db object that will show clear errors if used
    db = {
        _errorMessage: "Firebase initialization failed",
        collection: () => {
            console.error("Firebase was not initialized properly. Check your configuration.");
            return { getDocs: () => Promise.reject(new Error("Firebase not initialized")) };
        }
    };
}

export { db };

// Hook to fetch slider data from Firestore
export const useSliderLister = () => {
    const [sliderData, setSliderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log("Starting to fetch sliders from Firestore...");

                // Check if db is properly initialized
                if (!db || db._errorMessage) {
                    throw new Error("Firebase database not properly initialized");
                }

                // Make sure your collection name matches exactly what's in Firebase console
                const sliderCollection = collection(db, 'Slider');
                console.log("Slider collection reference created");

                const snapshot = await getDocs(sliderCollection);
                console.log("Got snapshot with", snapshot.size, "documents");

                if (snapshot.empty) {
                    console.log("No slider documents found in collection");
                }

                const sliders = [];
                snapshot.forEach((doc) => {
                    console.log("Document data:", JSON.stringify(doc.data()));
                    sliders.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setSliderData(sliders);
                console.log("Fetched slider data:", sliders);
            } catch (error) {
                console.error("Error fetching sliders:", error);
                setError(error.message || "Failed to fetch slider data");
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    return { sliderData, loading, error };
};
