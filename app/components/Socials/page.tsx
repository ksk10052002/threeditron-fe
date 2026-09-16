import React from "react";
import Buttons from "./Buttons";

const Socials = () => {
  return (
    <div className="reative">
      <div className="fixed top-[50%] flex-col z-50">
        <Buttons
          href="https://wa.me/917209827299"
          image="/whatsapp.png"
          alt="whatsapp"
        />
        <Buttons
          href="https://www.instagram.com/3dit.ron/"
          image="/instagram.png"
          alt="instagram"
        />
        <Buttons href="tel:+917209827299" image="/mobile.png" alt="facebook" />
        {/* <Buttons
          href="https://www.twitter.com/"
          image="/twitter.png"
          alt="twitter"
        /> */}
      </div>
    </div>
  );
};

export default Socials;
