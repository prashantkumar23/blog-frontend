import { createTheme } from '@mui/material';


export const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            paper: "#FAF9F6",
            default: "#ffffff"
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.6)",
            disabled: "rgba(0, 0, 0, 0.38)"
        },
        primary: {
            main: "#000000"
        },
        secondary: {
            main: "#2B2B2B"
        }

    },
    typography: {
        fontFamily: [
            'PTSerif-Regular',
            "PTSerif-Bold",
            "PTSerif-BoldItalic",
            "PTSerif-Italic",
            "Poppins-Thin",
            "Poppins-Regular",
            "Poppins-Bold",
            'Arial',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(',')
    },
})

// Maybe in future....

// export const lightTheme = createTheme({
//     ...theme,
//     palette: {
//         ...theme.palette,
//         mode: "light",
//         background: {
//             paper: "#FAF9F6",
//             default: "#ffffff"
//         },
//         text: {
//             primary: "rgba(0, 0, 0, 0.87)",
//             secondary: "rgba(0, 0, 0, 0.6)",
//             disabled: "rgba(0, 0, 0, 0.38)"
//         },
//         primary: {
//             main: "#000000"
//         },
//         secondary: {
//             main: "#2B2B2B"
//         }
//     }
// })



// export const darkTheme = createTheme({
//     ...theme,
//     palette: {
//         ...theme.palette,
//         mode: "dark",
//         background: {
//             paper: "#2B2B2B",
//             default: "#000000"
//         },
//         text: {
//             primary: "rgba(255,255,255,1)",
//             secondary: "rgba(255, 255, 255, 0.7)",
//             disabled: "rgba(255, 255, 255, 0.5)"
//         },
//         primary: {
//             main: "#fff",
//             light: "#575151",
//             // contrastText: "#fff"
//         },
//         secondary: {
//             main: "#e6e6e6"
//         },
//     }
// })


