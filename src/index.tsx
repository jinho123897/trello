import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { darkTheme } from "./theme";
import { RecoilRoot } from "recoil";
import { Helmet } from "react-helmet";

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  -webkit-box-pack: start;
  font-size: 16px;
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  background-color: #f0f0f0;
  color: #333;
  line-height: 1.2;
  position: relative;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 3px;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: background-color 0.3s;
  }

  &:before {
    content: '';
    display: block;
    width: 50vw;
    height: 100vh;
    position: fixed;
    top: 0;
    background-color: #212121;
  }
}
a {
  text-decoration:none;
  color:inherit;
}
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <ThemeProvider theme={darkTheme}>
      <Helmet>
        <title>To Do List</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap"
        />
      </Helmet>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </RecoilRoot>
  // </React.StrictMode>
);
