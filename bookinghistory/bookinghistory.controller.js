import BookingHistoryService from "./bookinghistory.service.js";

export const getBookingHistoryController = async (req, res) => {
    try {
        const bookingHistoryService = new BookingHistoryService();
        const history = await bookingHistoryService.getBookingHistory();

        if (history.length === 0) {
            return res.status(404).send({
                status: "fail",
                code: 0,
                message: "No booking history found",
                result: [],
            });
        }

        res.status(200).send({
            status: "success",
            code: 1,
            message: "Booking history retrieved successfully",
            result: history,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({
            status: "error",
            code: 0,
            message: "An error occurred while retrieving booking history",
            cause: error.message,
            result: "",
        });
    }
};