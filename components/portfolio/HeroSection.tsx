"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, ChevronDown } from "lucide-react";

export function HeroSection() {
    const [text, setText] = useState("");
    const fullText = "Python Software Developer";
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setText(fullText.slice(0, index + 1));
                setIndex(index + 1);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [index]);

    return (
        <section className="min-h-screen flex items-center justify-center relative px-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
                        Available for opportunities
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                    Hi, I'm{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Alex Chen
                    </span>
                </h1>

                <h2 className="text-2xl md:text-3xl text-slate-300 mb-8 h-10">
                    {text}
                    <span className="animate-pulse">|</span>
                </h2>

                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
                    Passionate about building scalable applications, automating workflows,
                    and creating elegant solutions to complex problems. Specializing in
                    backend development, data engineering, and machine learning.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <a
                        href="#projects"
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                        View My Work
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300"
                    >
                        Get In Touch
                    </a>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                    >
                        <Github className="w-6 h-6 text-slate-300 hover:text-white" />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                    >
                        <Linkedin className="w-6 h-6 text-slate-300 hover:text-white" />
                    </a>
                    <a
                        href="mailto:alex@example.com"
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                    >
                        <Mail className="w-6 h-6 text-slate-300 hover:text-white" />
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <a
                href="#about"
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            >
                <ChevronDown className="w-8 h-8 text-slate-400" />
            </a>
        </section>
    );
}
