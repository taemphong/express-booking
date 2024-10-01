import NewsService from './new.service.js';

// สำหรับสร้างข่าวสาร 
export const createNewsController = async (req, res) => {
    const newsData = {
        title: req.body.title,
        content: req.body.content,
        published_date: req.body.published_date,
        is_active: req.body.is_active ?? true,
        author_name: req.body.author_name || null, 
    };

    try {
        const newsService = new NewsService();
        const result = await newsService.createNews(newsData);
        res.status(201).send({
            status: "success",
            code: 1,
            message: "News created successfully",
            result,
        });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            result: "",
        });
    }
};

//แก้ไขขา่วสารสามารถแก้บางส่วนได้
export const updateNewsController = async (req, res) => {
    const { news_id } = req.params;
    const newsData = {
        title: req.body.title,
        content: req.body.content,
        published_date: req.body.published_date,
        is_active: req.body.is_active ?? true,
        author_name: req.body.author_name || null, 
    };

    try {
        const newsService = new NewsService();
        const result = await newsService.updateNews(news_id, newsData);
        if (result.affectedRows) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "News updated successfully",
                result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "News not found",
                result: "",
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            result: "",
        });
    }
};

// สำหรับลบข่าวสาร
export const deleteNewsController = async (req, res) => {
    const { news_id } = req.params;

    try {
        const newsService = new NewsService();
        const result = await newsService.deleteNews(news_id);

        if (result.affectedRows) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "News deleted successfully",
                result: "",
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "News not found",
                result: "",
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};

//getbyid
export const getNewsByIdController = async (req, res) => {
    const { news_id } = req.params;

    try {
        const newsService = new NewsService();
        const news = await newsService.getNewsById(news_id);

        if (news) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "News retrieved successfully",
                result: news,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "News not found",
                result: "",
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};