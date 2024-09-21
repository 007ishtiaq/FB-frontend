// src/components/Pixel.js
import React from "react";
import { Helmet } from "react-helmet";

const Pixel = () => (
  <Helmet>
    <script>
      {`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '414841081628906', {}, { autoConfig: false, debug: true });
      fbq('dataProcessingOptions', ['LDU'], 0, 0);
      `}
    </script>
    <noscript>
      {`
        <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=414841081628906&ev=PageView&noscript=1"/>
      `}
    </noscript>
    {/* <script>
      {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '414841081628906');
bq('track', 'PageView');`}
    </script>
    <noscript>
      {`
        <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=414841081628906&ev=PageView&noscript=1"/>
      `}
    </noscript> */}
  </Helmet>
);

export default Pixel;
