interface IEmailData {
  name: string;
  title: string;
  message: string;
}

export function defaultMailTemplate(data: IEmailData) {
  return `<!DOCTYPE html>
        <html>
        <head>
            <title>${data.title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    color: #333333;
                }
                
                p {
                    color: #555555;
                    margin-bottom: 20px;
                }
                
                .details {
                    background-color: #f7f7f7;
                    padding: 15px;
                    border-radius: 5px;
                }
                
                .details p {
                    margin: 0;
                }
                
                .bold {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${data.title}</h1>
                <p>Dear <span class="bold">${data.name}</span>,</p>
                <p>Thank you for using LancemeUp Space.</p>
                
                <div class="details">
                    ${data.message}
                </div>
                
                <p>If you have any questions or need further assistance, please feel free to contact our customer service.</p>
                
            </div>
        </body>
        </html>`;
}
