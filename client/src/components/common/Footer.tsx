import React from "react";

const Footer: React.FC = () => {
    return (
        <section className="w-screen h-20 bg-neutral-900 flex items-center justify-center">
            <p className="text-white">© {new Date().getFullYear()} Marai</p>
        </section>
    )
}

export default Footer