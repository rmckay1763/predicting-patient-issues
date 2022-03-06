import React from "react";
import { useNavigate } from "react-router-dom";

import NotificationPanel from "./NotificationPanel";
import { useViewport } from "../contexts/Dimensions";

/**
 * @returns Renders the notification panel as its own page. 
 * Only renders if screen size is less than breakpoint (single pane mode).
 */
export default function NotificationPage() {

    const navigate = useNavigate();
    const { width } = useViewport();
    const breakpoint = 900;

    if (width > breakpoint) {
        navigate("/")
    }

    return (
        <NotificationPanel />
    )
}