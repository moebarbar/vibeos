"use client";

import { Code2, Database, Brain, Zap } from "lucide-react";

export function AboutSection() {
    const highlights = [
        {
            icon: <Code2 className="w-6 h-6" />,
            title: "Clean Code",
            description: "Writing maintainable, well-documented code",
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: "Data Engineering",
            description: "Building robust data pipelines and ETL processes",
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Machine Learning",
            description: "Developing intelligent ML models and solutions",
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automation",
            description: "Streamlining workflows with Python scripts",
        },
    ];

    return (
        <section id="about" className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About Me
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20" />
                            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-6xl">👨‍💻</span>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Alex Chen
                                    </h3>
                                    <p className="text-slate-400">San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                            I'm a passionate Python software developer with over 5 years of
                            experience building scalable applications and data-driven
                            solutions. My journey in software development started with a
                            curiosity for automation and has evolved into a deep expertise in
                            backend systems, data engineering, and machine learning.
                        </p>
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                            When I'm not coding, you can find me contributing to open-source
                            projects, writing technical blog posts, or exploring the latest
                            advancements in AI and machine learning. I believe in continuous
                            learning and sharing knowledge with the developer community.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {highlights.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors duration-300"
                                >
                                    <div className="text-blue-400 mb-2">{item.icon}</div>
                                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                                    <p className="text-slate-400 text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
