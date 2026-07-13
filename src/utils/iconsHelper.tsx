import SvgIcon from "@mui/material/SvgIcon";

type IconProps = { className?: string };

export const ErrorIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </SvgIcon>
);

export const InfoIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </SvgIcon>
);

export const BackArrowIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </SvgIcon>
);

export const AddCircleIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </SvgIcon>
);

export const RemoveCircleIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
  </SvgIcon>
);

export const FirstPageIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
    <path d="M24 24H0V0h24v24z" fill="none" />
  </SvgIcon>
);

export const KeyboardArrowLeftIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
  </SvgIcon>
);

export const KeyboardArrowRightIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
  </SvgIcon>
);

export const LastPageIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
  </SvgIcon>
);

export const EmailIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </SvgIcon>
);

export const DarkModeIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
  </SvgIcon>
);

export const LightModeIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z" />
  </SvgIcon>
);

export const LogOutIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </SvgIcon>
);

export const DownloadPdfIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
  </SvgIcon>
);

export const PrinterIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
  </SvgIcon>
);

export const EditIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </SvgIcon>
);

export const DeleteIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
  </SvgIcon>
);

export const SearchIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </SvgIcon>
);

export const RefreshIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M17.91 14c-.478 2.833-2.943 5-5.91 5-3.308 0-6-2.692-6-6s2.692-6 6-6h2.172l-2.086 2.086L13.5 10.5 18 6l-4.5-4.5-1.414 1.414L14.172 5H12c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.08 0 7.438-3.055 7.93-7h-2.02z" />
  </SvgIcon>
);

export const CashierIcon = (props: IconProps) => (
  <SvgIcon viewBox="0 0 640 640" {...props}>
    <path d="M160 64C124.7 64 96 92.7 96 128C96 163.3 124.7 192 160 192L208 192L208 224L151 224C119.4 224 92.5 247.1 87.7 278.4L65.1 428.1C64.4 432.8 64 437.6 64 442.4L64 512C64 547.3 92.7 576 128 576L512 576C547.3 576 576 547.3 576 512L576 442.4C576 437.6 575.6 432.8 574.9 428L552.2 278.4C547.5 247.1 520.6 224 489 224L272 224L272 192L320 192C355.3 192 384 163.3 384 128C384 92.7 355.3 64 320 64L160 64zM160 112L320 112C328.8 112 336 119.2 336 128C336 136.8 328.8 144 320 144L160 144C151.2 144 144 136.8 144 128C144 119.2 151.2 112 160 112zM128 488C128 474.7 138.7 464 152 464L488 464C501.3 464 512 474.7 512 488C512 501.3 501.3 512 488 512L152 512C138.7 512 128 501.3 128 488zM176 328C162.7 328 152 317.3 152 304C152 290.7 162.7 280 176 280C189.3 280 200 290.7 200 304C200 317.3 189.3 328 176 328zM296 304C296 317.3 285.3 328 272 328C258.7 328 248 317.3 248 304C248 290.7 258.7 280 272 280C285.3 280 296 290.7 296 304zM224 408C210.7 408 200 397.3 200 384C200 370.7 210.7 360 224 360C237.3 360 248 370.7 248 384C248 397.3 237.3 408 224 408zM392 304C392 317.3 381.3 328 368 328C354.7 328 344 317.3 344 304C344 290.7 354.7 280 368 280C381.3 280 392 290.7 392 304zM320 408C306.7 408 296 397.3 296 384C296 370.7 306.7 360 320 360C333.3 360 344 370.7 344 384C344 397.3 333.3 408 320 408zM488 304C488 317.3 477.3 328 464 328C450.7 328 440 317.3 440 304C440 290.7 450.7 280 464 280C477.3 280 488 290.7 488 304zM416 408C402.7 408 392 397.3 392 384C392 370.7 402.7 360 416 360C429.3 360 440 370.7 440 384C440 397.3 429.3 408 416 408z" />
  </SvgIcon>
);

export const ConfigIcon = (props: IconProps) => (
  <SvgIcon viewBox="0 0 640 640" {...props}>
    <path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" />
  </SvgIcon>
);

export const SaveDiskIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="0 0 24 24" {...props}>
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
        fill="#FFF"
      />{" "}
    </g>
  </SvgIcon>
);

export const ClearIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="-5.5 0 32 32" {...props}>
    <path d="M2.125 13.781l7.938-7.938c0.719-0.719 1.813-0.719 2.531 0l7.688 7.688c0.719 0.719 0.719 1.844 0 2.563l-7.938 7.938c-2.813 2.813-7.375 2.813-10.219 0-2.813-2.813-2.813-7.438 0-10.25zM11.063 22.75l-7.656-7.688c-2.125 2.125-2.125 5.563 0 7.688s5.531 2.125 7.656 0z" />
  </SvgIcon>
);

export const MoveIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="0 0 16 16" {...props}>
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
    <g id="SVGRepo_iconCarrier">
      <g>
        <path d="M2.69,8.47A4.83,4.83,0,0,1,7.52,3.64H12V6l3-3L12,0V2.24H7.52a6.23,6.23,0,0,0,0,12.46H8V13.3H7.52A4.84,4.84,0,0,1,2.69,8.47ZM9,9.7h6V8.3H9Zm0,5h6V13.3H9Z" />{" "}
      </g>
    </g>
  </SvgIcon>
);

export const InvoiceIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="0 0 24 24" {...props}>
    <path
      id="secondary"
      d="M8,7H5.5A1.5,1.5,0,0,0,4,8.5H4A1.5,1.5,0,0,0,5.5,10h1A1.5,1.5,0,0,1,8,11.5H8A1.5,1.5,0,0,1,6.5,13H4"
      style={{ fill: "none", stroke: "#FFF", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }}
    />
    <path
      id="secondary-2"
      data-name="secondary"
      d="M10,17h6m-4-4h4M6,7V6m0,8V13"
      style={{ fill: "none", stroke: "#FFF", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }}
    />
    <path
      id="primary"
      d="M9,3H19a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V18"
      style={{ fill: "none", stroke: "#FFF", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }}
    />
  </SvgIcon>
);

export const ArrowDropDownIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="-6.5 0 32 32" {...props}>
    <path d="M18.813 11.406l-7.906 9.906c-0.75 0.906-1.906 0.906-2.625 0l-7.906-9.906c-0.75-0.938-0.375-1.656 0.781-1.656h16.875c1.188 0 1.531 0.719 0.781 1.656z"></path>
  </SvgIcon>
);

export const CheckBoxIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="0 0 32 32" {...props}>
    <path fill="#FFF" d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM6,26V6H26V26Z" />
    <polygon fill="#FFF" points="14 21.5 9 16.54 10.59 15 14 18.35 21.41 11 23 12.58 14 21.5" />
    <rect fill="none" id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" width="32" height="32" />
  </SvgIcon>
);

export const UnCheckBoxIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="0 0 32 32" {...props}>
    <path fill="#FFF" d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM6,26V6H26V26Z" />
    <rect fill="none" data-name="&lt;Transparent Rectangle&gt;" width="32" height="32" />
  </SvgIcon>
);

export const ViewListIcon = (props: IconProps) => (
  <SvgIcon width="800px" height="800px" viewBox="0 0 16 16" {...props}>
    <path
      fill="#FFF"
      d="m 13.5 2.007812 s 0.5 0.222657 0.5 0.5 v 0.988282 c 0 0.273437 -0.5 0.5 -0.5 0.5 h -1 s -0.5 -0.226563 -0.5 -0.5 v -0.988282 c 0 -0.277343 0.5 -0.5 0.5 -0.5 z m -4 0 c 0.277344 0 0.5 0.222657 0.5 0.5 v 0.988282 c 0 0.273437 -0.222656 0.5 -0.5 0.5 h -8 c -0.277344 0 -0.5 -0.226563 -0.5 -0.5 v -0.988282 c 0 -0.277343 0.222656 -0.5 0.5 -0.5 z m 4 5 s 0.5 0.222657 0.5 0.5 v 0.988282 c 0 0.273437 -0.5 0.5 -0.5 0.5 h -1 s -0.5 -0.226563 -0.5 -0.5 v -0.988282 c 0 -0.277343 0.5 -0.5 0.5 -0.5 z m -4 0 s 0.5 0.222657 0.5 0.5 v 0.988282 c 0 0.273437 -0.222656 0.5 -0.5 0.5 h -8 c -0.277344 0 -0.5 -0.226563 -0.5 -0.5 v -0.988282 c 0 -0.277343 0.5 -0.5 0.5 -0.5 z m 4 5 c 0.277344 0 0.5 0.222657 0.5 0.5 v 0.988282 c 0 0.273437 -0.5 0.5 -0.5 0.5 h -1 s -0.5 -0.226563 -0.5 -0.5 v -0.988282 c 0 -0.277343 0.222656 -0.5 0.5 -0.5 z m -4 0 c 0.277344 0 0.5 0.222657 0.5 0.5 v 0.988282 c 0 0.273437 -0.222656 0.5 -0.5 0.5 h -8 c -0.277344 0 -0.5 -0.226563 -0.5 -0.5 v -0.988282 c 0 -0.277343 0.222656 -0.5 0.5 -0.5 z m 0 0"
    />
  </SvgIcon>
);
