import axios from "axios";
import FormData from "form-data";

export const processResumes = async (req, res) => {
  try {
    const files = req.files;
    const { jd } = req.body;

    if (!files?.length) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    if (!jd) {
      return res.status(400).json({ message: "Job Description (jd) is required." });
    }

    
    const fileDataList = files.map((file, idx) => ({
      url: file.path, 
      filename: `resume_${idx + 1}.pdf`, 
    }));

    
    const formData = new FormData();
    formData.append("jd", jd);

    
    await Promise.all(
      fileDataList.map(async ({ url, filename }) => {
        const response = await axios.get(url, { responseType: "stream" });
        formData.append("files", response.data, {
          filename,
          contentType: "application/pdf",
        });
      })
    );

    // Step 4: Send data to FastAPI
    const fastApiResponse = await axios.post(
      "http://localhost:8000/score-resumes",
      formData,
      { headers: formData.getHeaders() }
    );

    const fastApiResults = fastApiResponse.data.results;

    
    const rankedResults = fastApiResults.map((result) => {
      const matchedFile = fileDataList.find((f) => f.filename === result.filename);
      return {
        ...result,
        pdfUrl: matchedFile ? matchedFile.url : null,
      };
    });

    // Step 6: Sort by score descending
    rankedResults.sort((a, b) => b.score - a.score);

    return res.status(200).json({ rankedResults });

  } catch (error) {
    console.error("Error processing resumes:", error);
    return res.status(500).json({ message: "Server error while processing resumes." });
  }
};
