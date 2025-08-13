import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTwitter,
  IconLink,
} from "@tabler/icons-react";
import "./social.css";

export const Socials = () => {
  return (
    <div className="card">
      <a
        className="socialContainer containerOne"
        href="https://www.instagram.com/nowatoken/"
        target="_blank"
      >
        <IconBrandInstagram className="socialSvg instagramSvg" />
      </a>

      <a
        className="socialContainer containerTwo"
        href="https://x.com/Nowatoken"
        target="_blank"
      >
        <IconBrandTwitter className="socialSvg twitterSvg" />
      </a>

      <a
        className="socialContainer containerThree"
        href="https://t.me/nowatoken"
        target="_blank"
      >
        <IconBrandTelegram className="socialSvg linkdinSvg" />
      </a>

      <a
        className="socialContainer containerFour"
        href="https://nowory.com"
        target="_blank"
      >
        <IconLink className="socialSvg whatsappSvg" />
      </a>
    </div>
  );
};
