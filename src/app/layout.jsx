import "./globals.css";

export const metadata = {
  title: "beyond funds",
  description: "beyond",
  name: "robots",
  content: "noindex,nofollow"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link href="https://fonts.cdnfonts.com/css/galano-grotesque-alt" rel="stylesheet"/>         
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
