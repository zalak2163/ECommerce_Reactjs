import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.heather_ford}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            At Forever, we believe in delivering high-quality fashion with a
            touch of elegance. Our mission is to provide our customers with
            trendy, affordable, and comfortable clothing that meets both style
            and function. We are passionate about helping you express yourself
            through fashion, ensuring you always feel confident in what you
            wear.
          </p>
          <p>
            We source our pieces carefully, with attention to detail, to bring
            you the latest styles that suit every occasion. Whether it's a
            casual outfit for the weekend, or something special for an event,
            our collection is designed to cater to a wide range of tastes and
            needs. At [Your Brand Name], we aim to make high-fashion accessible
            to everyone.
          </p>
          <b className="text-gary=800">Our Mission</b>
          <p>
            Our mission is simple: to offer our customers the best in fashion,
            style, and service. We focus on providing clothing that makes you
            feel good, inside and out. We believe that fashion is not just about
            what you wear, but how you wear it. That’s why we strive to bring
            you timeless pieces that fit seamlessly into your lifestyle, without
            compromising on quality or comfort.
          </p>
          <p>
            We are committed to staying ahead of trends and delivering on our
            promise of exceptional customer service. We aim to build lasting
            relationships with our customers, ensuring that each shopping
            experience is as enjoyable and satisfying as the last.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex f;ex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We believe in offering only the highest-quality clothing and
            accessories. Every item in our collection undergoes strict quality
            control checks to ensure it meets our high standards. From the
            fabric to the stitching, we are committed to delivering pieces that
            will stand the test of time. Our quality promise guarantees that
            your purchase will not only look good but will also last longer.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Shopping with us is hassle-free. We offer a seamless shopping
            experience, from browsing through our easy-to-navigate website to
            fast and reliable delivery options. Whether you're shopping from
            home or on the go, we make it easy to find what you're looking for
            and get it delivered right to your door. Plus, with our easy return
            and exchange policies, shopping with us is always a breeze.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            We pride ourselves on providing excellent customer support, 24/7.
            Our friendly and knowledgeable team is always here to help with any
            questions or concerns you may have. Whether you need assistance with
            sizing, delivery, or product details, we are just a message or phone
            call away. Your satisfaction is our top priority, and we are
            dedicated to making every shopping experience with us a positive
            one.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
