import layout104 from './layout104.json';
import layout108 from './layout108.json';
import layout40 from './layout40.json';
import layout60 from './layout60.json';
import layout65 from './layout65.json';
import layout68 from './layout68.json';
import layout75 from './layout75.json';
import layoutTKL from './layoutTKL.json';

export const layouts = {
    "104": layout104,
    "108": layout108,
    "40": layout40,
    "60": layout60,
    "65": layout65,
    "68": layout68,
    "75": layout75,
    "tkl": layoutTKL,
};

export const layoutOptions = [
    { id: "108", name: "Full Size 108" },
    { id: "104", name: "Full Size 104" },
    { id: "tkl", name: "Tenkeyless (TKL)" },
    { id: "75", name: "75% Compact" },
    { id: "68", name: "68% Compact (RK68)" },
    { id: "65", name: "65% Compact" },
    { id: "60", name: "60% Compact" },
    { id: "40", name: "40% Mini" },
];
