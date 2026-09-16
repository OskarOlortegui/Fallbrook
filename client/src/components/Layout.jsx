import { Outlet } from "react-router";
import Topbar from "./Topbar";
import Footer from './Footer';

export default function Layout() {
    return(
        <div className="min-h-screen bg-(--bg) text-(--text)">
            <Topbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}