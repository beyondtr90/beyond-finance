"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LogoutButton = () => {
    const router = useRouter();
    const URL = process.env.NEXT_PUBLIC_BASE_URL;

    async function handleLogout(event) {
        event.preventDefault();

        const response = await fetch(`${URL}/api/logout`, {
            method: "POST",
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data.message);
            router.push("/login");
            window.location.reload();
        } else {
            console.error(data.error);
        }
    }

    return (
        <Link href="" onClick={handleLogout} className="logout-button">
            Oturumu Kapat
            <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/forward--v1.png"
                alt="forward--v1"
            />
        </Link>
    );
};

export default LogoutButton;
