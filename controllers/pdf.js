import pdf from "../models/pdf.js"
export const addPdfInLessonById = async (req,res)=>{

    try {
        const { lessonId } = req.params;
        const { pdfName}= req.body;
        const response = pdf.create({
            lessonId,
            pdfName, 
            pdfSrc:req.uploadedFile,
        })
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}
export const getPdfsByLessonId = async (req, res) => {
    try {
      const  lessonId  = req.params;
      const pdfs = await pdf.find(lessonId);
      res.status(200).json(pdfs);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  }; 
export const deletePdfById = async (req,res)=>{
    try {
        const {pdfId} = req.params;
        const response = await pdf.findByIdAndDelete(pdfId);
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });

    }
}