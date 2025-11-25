import axios from 'axios';

const TIME_OUT = 0; // FOR TEST LOADING TIME

export const apiRequest = async (endpoint, method = "GET", body = null, token = null) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            // Add authorization header if token is provided
            ...(token && { "Authorization": `Bearer ${token}` })
        };

        const baseUrl = import.meta.env.VITE_BASE_URL;
        const url = `${baseUrl}${endpoint}`;

        const config = {
            method: method.toLowerCase(),
            url,
            headers,
            withCredentials: true, // equivalent to credentials: "include"
            data: body ? JSON.stringify(body) : undefined
        };

        const response = await axios(config);

        if (TIME_OUT > 0) {
            await new Promise((resolve) => setTimeout(resolve, TIME_OUT));
        }

        return response.data;
    } catch (error) {
        const response = error.response;

        // CHECK IF AUTHENTICATED USER
        if (response?.status === 401) {
            // Redirection vers la page de connexion
            window.location.href = "/#/login";
        } else {
            // 🚨 Gestion d'erreur spécifique Prisma : contrainte FK violée
            const errorMessage = response?.data?.error || error.message;

            // 💬 Ajout d'une gestion globale des contraintes FK de Prisma
            if (
                errorMessage?.includes("Foreign key constraint failed") ||
                errorMessage?.includes("constraint violated") ||
                errorMessage?.includes("P2003") // Code d'erreur Prisma FK
            ) {
                throw {
                    message: "Impossible de supprimer cet élément car il est encore utilisé dans d'autres enregistrements.",
                    status: response?.status
                };
            }

            console.error(`API Error (${response?.status ?? "UNKNOWN"}):`, error.message);
        }

        throw {
            message: response?.data?.error ||
                error.message ||
                "Une erreur est survenue lors de la requête.",
            status: response?.status
        };
    }
};



// import axios from 'axios';

// const TIME_OUT = 0; // FOR TEST LOADING TIME

// export const apiRequest = async (endpoint, method = "GET", body = null, token = null) => {
//     try {
//         const headers = {
//             "Content-Type": "application/json",
//             // Add authorization header if token is provided
//             ...(token && { "Authorization": `Bearer ${token}` })
//         };

//         const baseUrl = import.meta.env.VITE_BASE_URL;
//         const url = `${baseUrl}${endpoint}`;

//         const config = {
//             method: method.toLowerCase(),
//             url,
//             headers,
//             withCredentials: true, // equivalent to credentials: "include"
//             data: body ? JSON.stringify(body) : undefined
//         };

//         const response = await axios(config);

//         if (TIME_OUT > 0) {
//             await new Promise((resolve) => setTimeout(resolve, TIME_OUT));
//         }

//         return response.data;
//     } catch (error) {
//         // Axios wraps the response error in error.response
//         const response = error.response;

//         // CHECK IF AUTHENTICATED USER
//         if (response?.status === 401) {
//             // Redirection vers la page de connexion
//             window.location.href = "/#/login";
//         } else {
//             console.error(`API Error (${response?.status ?? "UNKNOWN"}):`,
//                 error.message);
//         }

//         throw {
//             message: response?.data?.error ||
//                 error.message ||
//                 "Une erreur est survenue lors de la requête.",
//             status: response?.status
//         };
//     }
// };