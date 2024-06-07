import { allCarData } from "../data/Data.js";
function removeDups(arr) {
    const unique = arr.filter((obj, index) => {
        return index === arr.findIndex((o) => obj.name_modal === o.name_modal && obj.type === o.type && obj.price === o.price);
    });
    return unique;
}
export async function removeDuplicateAndSaveAllData(req, res) {
    try {
        res.send(removeDups(allCarData));
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
}
