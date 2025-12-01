import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { fr } from "date-fns/locale";

export function formatDateAgo(theDate) {
    return formatDistanceToNow(new Date(theDate), {
        addSuffix: true,
        locale: fr,
    })
}

export const getUserRole = (user) => {
    let re = "";
    switch (user?.role) {
        case "ADMIN":
            re = `Administrateur`;
            break;

        case "SUPER_ADMIN":
            re = `Super Administrateur`;
            break;

        case "USER":
            re = `Utilisateur`;
            break;

        default:
            re = `NON ATTRIBUÉ`;
            break;
    }
    return re;
};

// CETTE FONCTION SERT POUR CREER UNE LISTE POUR PAGINATION
export function getMultiplesOf(num, mult = 10) {
    let multiples = [];

    // Si le nombre est inférieur à mult, retourner [mult]
    if (num < mult) {
        return [mult];
    }

    // Trouver les multiples de mult jusqu'à num
    const pagesNumber = Math.ceil(num / mult)

    for (let i = 1; i <= pagesNumber; i++) {
        multiples.push(mult * i);
    }

    return multiples;
}


// EXCEL EXPORT
// import * as XLSX from "xlsx";
// import { format } from 'date-fns';
// export const exportExcel = (tableId, title = "exportedData") => {
//     const dateNow = new Date()
//     const formattedDate = format(dateNow, 'dd_MM_yyyy_HH_mm_ss');
//     const table = document.getElementById(tableId);
//     const workbook = XLSX.utils.table_to_book(table);
//     XLSX.writeFile(workbook, `${title + "_" + formattedDate}.xlsx`);
// };
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportExcel = (tableId, title = "exportedData") => {
    const dateNow = new Date();
    const formattedDate = format(dateNow, 'dd_MM_yyyy_HH_mm_ss');

    const table = document.getElementById(tableId);
    const rows = Array.from(table.querySelectorAll('tr')).map(row =>
        Array.from(row.querySelectorAll('th, td')).map(cell => {
            const value = cell.innerText.trim();

            // Match a date format like 2025-04-01 or 01/04/2025
            const dateRegex = /^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/;
            if (dateRegex.test(value)) {
                return { v: value, t: 's' }; // force as string (text)
            }
            return value;
        })
    );

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');

    XLSX.writeFile(workbook, `${title}_${formattedDate}.xlsx`);
};
