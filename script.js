function toggleJudgingCat() {
    const cat = document.getElementById('judgingCat');
    const message = document.getElementById('judgingMessage');
    if (cat.style.display === 'none' || cat.style.display === '') {
        cat.style.display = 'block';
        message.style.display = 'block';
    } else {
        cat.style.display = 'none';
        message.style.display = 'none';
    }
}

function getDarkerDominantColors(imgEl, numColors = 2) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;
    ctx.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);

    let imageData;
    try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (error) {
        console.error("Error getting image data:", error);
        return ['rgb(51, 51, 51)', 'rgb(102, 102, 102)']; 
    }
    const data = imageData.data;

    const colorCounts = {};

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue;

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        const weight = Math.pow(255 - brightness, 1.8);

        const color = `${r},${g},${b}`;

        if (!colorCounts[color]) {
            colorCounts[color] = 0;
        }

        colorCounts[color] += weight;
    }

    const sortedColors = Object.entries(colorCounts).sort(([, countA], [, countB]) => countB - countA);

    const dominantColors = sortedColors.slice(0, numColors).map(([color]) => {
        const rgb = color.split(',').map(Number);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    });

    function getLuminance(rgbColor) {
        const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    dominantColors.sort((colorA, colorB) => getLuminance(colorA) - getLuminance(colorB));

    return dominantColors;
}

document.addEventListener('DOMContentLoaded', () => {
    const logoImg = document.querySelector('.logo img');

    logoImg.onload = () => {
        const dominantColors = getDarkerDominantColors(logoImg);

        if (dominantColors.length >= 2) {
            document.body.style.backgroundImage = `linear-gradient(135deg, ${dominantColors[0]}, ${dominantColors[1]})`;
        } else if (dominantColors.length === 1) {
            document.body.style.backgroundColor = dominantColors[0];
        } else {
            document.body.style.backgroundColor = 'rgb(51, 51, 51)';
        }

        document.body.style.backgroundAttachment = 'fixed';
    };
    if (logoImg.complete) {
        logoImg.onload();
    }
});