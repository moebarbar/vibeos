"use client";

export function SkillsSection() {
    const skillCategories = [
        {
            title: "Programming Languages",
            skills: [
                { name: "Python", level: 95 },
                { name: "JavaScript/TypeScript", level: 80 },
                { name: "SQL", level: 90 },
                { name: "Bash/Shell", level: 85 },
            ],
        },
        {
            title: "Frameworks & Libraries",
            skills: [
                { name: "Django/FastAPI", level: 90 },
                { name: "Flask", level: 85 },
                { name: "Pandas/NumPy", level: 95 },
                { name: "TensorFlow/PyTorch", level: 80 },
            ],
        },
        {
            title: "Tools & Technologies",
            skills: [
                { name: "Docker/Kubernetes", level: 85 },
                { name: "AWS/GCP", level: 80 },
                { name: "PostgreSQL/MongoDB", level: 90 },
                { name: "Git/GitHub", level: 95 },
            ],
        },
        {
            title: "Specializations",
            skills: [
                { name: "Data Engineering", level: 90 },
                { name: "Machine Learning", level: 85 },
                { name: "API Development", level: 95 },
                { name: "Automation", level: 90 },
            ],
        },
    ];

    return (
        <section id="skills" className="py-24 px-4 bg-slate-800/30">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Skills & Expertise
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
                    <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
                        A comprehensive toolkit built over years of hands-on experience
                        in software development and data engineering.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {skillCategories.map((category, categoryIndex) => (
                        <div
                            key={categoryIndex}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-blue-500/30 transition-colors duration-300"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">
                                {category.title}
                            </h3>
                            <div className="space-y-4">
                                {category.skills.map((skill, skillIndex) => (
                                    <div key={skillIndex}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-300">{skill.name}</span>
                                            <span className="text-slate-400">{skill.level}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${skill.level}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional skills tags */}
                <div className="mt-12 text-center">
                    <h3 className="text-xl font-bold text-white mb-6">
                        Other Technologies I Work With
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            "Redis",
                            "Celery",
                            "RabbitMQ",
                            "GraphQL",
                            "REST APIs",
                            "Microservices",
                            "CI/CD",
                            "Linux",
                            "Nginx",
                            "Apache Spark",
                            "Airflow",
                            "Scikit-learn",
                            "OpenCV",
                            "Selenium",
                            "BeautifulSoup",
                            "Jupyter",
                        ].map((tech, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-slate-300 hover:border-blue-500/50 hover:text-white transition-colors duration-200"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
