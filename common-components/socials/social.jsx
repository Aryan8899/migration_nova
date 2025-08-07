import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTwitter,
  IconLink,
} from "@tabler/icons-react";
import "./social.css";

export const Socials = () => {
  return (
    <div class="card">
      <a class="socialContainer containerOne" href="#">
        <IconBrandInstagram className="socialSvg instagramSvg" />
      </a>

      <a class="socialContainer containerTwo" href="#">
        <IconBrandTwitter className="socialSvg twitterSvg" />
      </a>

      <a class="socialContainer containerThree" href="#">
        <IconBrandTelegram className="socialSvg linkdinSvg" />
      </a>

      <a class="socialContainer containerFour" href="#">
        <IconLink className="socialSvg whatsappSvg" />
      </a>
    </div>
  );
};
