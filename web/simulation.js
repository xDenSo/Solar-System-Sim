
async function init() {
    const canvas = document.getElementById("solarCanvas");
    const ctx = canvas.getContext("2d");

    // Canvas an die Fenstergröße anpassen
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // WebAssembly-Modul laden
    const physics = await SolarSystemModule();

    const planetCount = physics.ccall(
        "get_planet_count",
        "number",
        [],
        []
    );

    // Einstellungen
    let simulationTime = 0;
    const simulationSpeed = 0.2;

    // Planetennamen
    const planetNames = [
        "Merkur",
        "Venus",
        "Erde",
        "Mars",
        "Jupiter",
        "Saturn",
        "Uranus",
        "Neptun"
    ];

    // Farben
    const planetColors = [
        "#aaaaaa",
        "#e6c27a",
        "#3399ff",
        "#dd5533",
        "#d6a66a",
        "#d9c58b",
        "#8bd5df",
        "#477bd1"
    ];

    // Zeichengrößen (nicht maßstabsgetreu)
    const planetSizes = [
        5, 7, 7, 6, 13, 11, 9, 9
    ];

    let lastTime = performance.now();

    // Physikalische Position in Bildschirmposition umrechnen
    function transformPosition(x, y) {
        const distance = Math.sqrt(x * x + y * y);
        const angle = Math.atan2(y, x);

        // Nichtlineare Skalierung der Entfernungen
        const displayDistance = 45 * Math.pow(distance, 0.65);

        return {
            x: Math.cos(angle) * displayDistance,
            y: Math.sin(angle) * displayDistance
        };
    }

    function animate(currentTime) {
        const deltaTime = Math.min(
            (currentTime - lastTime) / 1000,
            0.05
        );

        lastTime = currentTime;
        simulationTime += deltaTime * simulationSpeed;

        const width = window.innerWidth;
        const height = window.innerHeight;

        const sunX = width / 2;
        const sunY = height / 2;

        // Hintergrund
        ctx.fillStyle = "#080b16";
        ctx.fillRect(0, 0, width, height);

        // Umlaufbahnen zeichnen
        for (let i = 0; i < planetCount; i++) {
            ctx.beginPath();

            const period = [
                0.2408, 0.6152, 1.0, 1.8808,
                11.86, 29.42, 83.75, 163.73
            ][i];

            for (let step = 0; step <= 360; step++) {
                const t = (step / 360) * period;

                const x = physics.ccall(
                    "get_planet_x",
                    "number",
                    ["number", "number"],
                    [i, t]
                );

                const y = physics.ccall(
                    "get_planet_y",
                    "number",
                    ["number", "number"],
                    [i, t]
                );

                const pos = transformPosition(x, y);

                const screenX = sunX + pos.x;
                const screenY = sunY - pos.y;

                if (step === 0) {
                    ctx.moveTo(screenX, screenY);
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            }

            ctx.closePath();
            ctx.strokeStyle = "rgba(160, 180, 210, 0.22)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Sonne zeichnen
        ctx.beginPath();
        ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffcc33";
        ctx.shadowColor = "#ffaa00";
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Planeten zeichnen
        for (let i = 0; i < planetCount; i++) {
            const x = physics.ccall(
                "get_planet_x",
                "number",
                ["number", "number"],
                [i, simulationTime]
            );

            const y = physics.ccall(
                "get_planet_y",
                "number",
                ["number", "number"],
                [i, simulationTime]
            );

            const pos = transformPosition(x, y);

            const screenX = sunX + pos.x;
            const screenY = sunY - pos.y;

            ctx.beginPath();
            ctx.arc(
                screenX,
                screenY,
                planetSizes[i],
                0,
                Math.PI * 2
            );

            ctx.fillStyle = planetColors[i];
            ctx.fill();

            // Planetenname
            ctx.fillStyle = "#ffffff";
            ctx.font = "13px Arial";
            ctx.fillText(
                planetNames[i],
                screenX + planetSizes[i] + 5,
                screenY - 5
            );

            // Saturnring
            if (i === 5) {
                ctx.beginPath();
                ctx.ellipse(
                    screenX,
                    screenY,
                    19,
                    7,
                    -0.25,
                    0,
                    Math.PI * 2
                );
                ctx.strokeStyle = "#c9b58a";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // Informationsanzeige
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.fillText(
            "Simulationszeit: " +
            simulationTime.toFixed(2) +
            " Jahre",
            25,
            35
        );

        ctx.font = "13px Arial";
        ctx.fillStyle = "#aab4c8";
        ctx.fillText(
            "Darstellung: Nichtlineare Entfernungs-Skalierung",
            25,
            58
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

init().catch(error => {
    console.error("Fehler beim Starten der Simulation:", error);
});

