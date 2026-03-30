"use client";

import { ExternalLink, Github, Star } from "lucide-react";

export function ProjectsSection() {
    const projects = [
        {
            title: "DataPipeline Pro",
            description:
                "A scalable ETL pipeline framework for processing large datasets. Built with Python, Apache Spark, and Airflow for orchestration. Handles 10M+ records daily with 99.9% uptime.",
            image: "/api/placeholder/600/400",
            tags: ["Python", "Apache Spark", "Airflow", "PostgreSQL", "Docker"],
            github: "https://github.com",
            demo: "https://demo.example.com",
            stars: 245,
        },
        {
            title: "ML Model Server",
            description:
                "Production-ready machine learning model serving platform. Supports TensorFlow, PyTorch, and scikit-learn models with automatic scaling and A/B testing capabilities.",
            image: "/api/placeholder/600/400",
            tags: ["Python", "FastAPI", "TensorFlow", "Docker", "Kubernetes"],
            github: "https://github.com",
            demo: "https://demo.example.com",
            stars: 189,
        },
        {
            title: "AutoScraper Framework",
            description:
                "Intelligent web scraping framework with built-in anti-detection mechanisms. Extracts structured data from complex websites with automatic pagination and rate limiting.",
            image: "/api/placeholder/600/400",
            tags: ["Python", "Selenium", "BeautifulSoup", "Redis", "Celery"],
            github: "https://github.com",
            demo: "https://demo.example.com",
            stars: 312,
        },
        {
            title: "API Gateway",
            description:
                "High-performance API gateway with rate limiting, authentication, and request routing. Built for microservices architecture with comprehensive monitoring and analytics.",
            image: "/api/placeholder/600/400",
            tags: ["Python", "FastAPI", "Redis", "PostgreSQL", "Prometheus"],
            github: "https://github.com",
            demo: "https://demo.example.com",
            stars: 156,
        },
        {
            title: "ChatBot Engine",
            description:
                "Conversational AI engine with natural language processing capabilities. Supports multiple channels including Slack, Discord, and custom web interfaces.",
            image: "/api/placeholder/600/400",
            tags: ["Python", "TensorFlow", "NLTK", "FastAPI", "WebSocket"],
            github: "https://github.com",
            demo: "https://demo.example.com",
            stars: 278,
        },
        {
            title: "Log Analyzer",
            description:
                "Real-time log analysis platform with anomaly detection and alerting. Processes millions of log entries per minute with intelligent pattern recognition.",
            image: "/api/placeholder/600/400",
            tags: ["Python", "Elasticsearch", "Kibana", "Redis", "Docker"],
            github: "https://github.com",
            demo: "https://demo.example.com",
            stars: 134,
        },
    ];

    return (
        <section id="projects" className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Featured Projects
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
                    <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
                        A selection of projects that showcase my expertise in Python
                        development, data engineering, and machine learning.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
                        >
                            {/* Project Image */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                                <div className="text-6xl">🚀</div>
                                <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white text-sm">{project.stars}</span>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
                                    {project.title}
                                </h3>
                                <p className="text-slate-400 mb-4 line-clamp-3">
                                    {project.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-3">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                                    >
                                        <Github className="w-4 h-4 text-slate-300" />
                                        <span className="text-slate-300 text-sm">Code</span>
                                    </a>
                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
                                    >
                                        <ExternalLink className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-400 text-sm">Demo</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300"
                    >
                        <Github className="w-5 h-5" />
                        View All Projects on GitHub
                    </a>
                </div>
            </div>
        </section>
    );
}
