import List from "../model/taskModel.js"

export const create = async (req, res) => {
    try {
        const listData = new List(req.body)
        const savedList = await listData.save();
        res.status(200).json(savedList)
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server error." })
    }
}

export const fetchAll = async (req, res) => {
    try {
        const listData = await List.find()
        res.status(200).json(listData)
        return res.status(200).json(listData)
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server error." })
    }
}

export const fetch = async (req, res) => {
    try {
        const title = req.params.title; // Getting the id from the URL
        console.log('Searched Title:', title);
        const listData = await List.findOne({ title: title });
        console.log('listData Result:', listData);
        if(listData==null){
            return res.status(404).json({message: "Task record not found"})
        }
        return res.status(200).json(listData)
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server error." })
    }
}

export const update = async (req, res) => {
    try {
        const title = req.params.title;
        const updatedList = await List.findOneAndUpdate(
            { title: title },
            req.body,
            { new: true } // returns the updated document
        );
        if (!updatedList) {
            return res.status(404).json({ message: "Task record not found" });
        }
        res.status(200).json(updatedList);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server error." });
    }
}

export const remove = async (req, res) => {
    try {
        const title = req.params.title;
        const deletedList = await List.findOneAndDelete({ title: title });
        if (!deletedList) {
            return res.status(404).json({ message: "Task record not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server error." });
    }
}