const {Error} = require("./Errors");
const {errorCodes} = require("./errorCodes");
const handleAxiosError = (axiosError, code = 0) => {
    if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let {status, data} = axiosError.response;
        let firstErrorData;
        if (status === 500) status = 503;
        // TODO: Handle Aggregate Errors
        if (Array.isArray(data)) firstErrorData = data[0]
        else firstErrorData = data
        if (firstErrorData.error?.message) firstErrorData = firstErrorData.error
        let niceError = errorCodes.get(status)?.name;
        console.error(JSON.stringify(data));
        // console.error(`An Error With The Following Headers Has Occured`, axiosError.response.headers);
        return new Error(firstErrorData?.code ? firstErrorData?.code : code, `${niceError ? niceError : "An Error Has Occurred"}`, status, firstErrorData?.message ? firstErrorData?.message : JSON.stringify(data));
    } else if (axiosError.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.error("Internal Request Failure", axiosError.request);
        return new Error(code, `An Error Has Occurred`, 503, `${axiosError.message ? axiosError.message : "An Internal Request has Failed"}`);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('An Internal Couldn\'t Be Initialized', axiosError.message);
        return new Error(code, `An Error Has Occurred`, 503, "An Internal Request Couldn't Be Initialized");
    }
}

module.exports = {
    handleAxiosError
}