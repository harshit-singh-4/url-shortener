import fs from "fs/promises";
import path from "path";
import ejs from "ejs";
import mjml2html from "mjml";

export const getHtmlFromMjmlTemplate = async (template, data) => {
  const mjmlTemplate = await fs.readFile(
    path.join(
      import.meta.dirname,
      "..",
      "emails",
      `${template}.mjml`
    ),
    "utf-8"
  );

  const filledTemplate =ejs.render(mjmlTemplate, data);
  const result =await mjml2html(filledTemplate);
  const htmlOutput =result.html;

  return htmlOutput; 
};
