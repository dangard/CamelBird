
       <div class="grid_14">
          <h1>Welcome to CamelBird.com</h1>
       </div>
       <div class="grid_2">
	     <div>
		   <p>
               <a href="gallery.php">Sample Web Application</a>
           </p>
           <p>
               <a href="code_sample.txt">The Code</a>
           </p>
		 </div>
       </div>
       <div class="clear"></div>
       <div class="grid_2">&nbsp;</div>
       <div id="mainContent" class="grid_12">
       <p>
           <span class="dropCap">W</span>elcome to the Portfolio Site of Daniel J. Gardner. Below you will find links to some of the websites I have worked on.
       </p> 
       <p>
           I am very passionate about <strong>user experience</strong> and <strong>UI</strong>. In addition I am a passionate <strong>customer advocate</strong>.
       </p>     
       <p>
           <strong>Programming Languages:</strong> Haskell, Visual Basic, Perl, Embedded Perl, Perl Mason, Java, Cold Fusion, SQL, ASP, PHP, JavaScript, and VBScript.
       </p>
       <p>
           <strong>Databases:</strong> MySQL, MS Sequel, and Oracle.
       </p>
       <p>
           To request a resume <a href="mailto:dangard@runbox.com">contact me</a>.
       </p>
       
       {foreach $rows as $row}
         <div class="jobDetail">
           <h2>{$row->company} <a href="{$row->website}">Website</a></h2>
           <div class="jobDetailBody">
             <h3>{$row->title}</h5>
             <p>{$row->description}</p>
             <p><strong>Skills:</strong> {$row->skills}</p>
           </div>
         </div>
       {/foreach}
       
       <h2>Classmates Online (<a href="www.classmates.com">Classmates.com</a>)</h2>
       <p>
           <a href="http://www.classmates.com/checkout/start">Checkout</a> (Must be Logged In)<br />
       </p>
       <p>
           In addition I am the primary UI developer for an internal CMS and A/B Testing tool and framework.
       </p>
       <h2>AT&amp;T Wireless/Cingular Wireless</h2>
       <p>
           <a href="http://www.cingular.com/">Online Store</a><br />
       </p>
       <h2>Marchex</h2>
       <p>
           Worked as a JAVA developer on one of the feed management systems as well as on the UI for an internal SEO/Marketing tool.
        </p>
        <h2>Amazon.com</h2>
        <p>
            <a href="http://www.amazon.com/magazines">The Magazine Subscription Store</a><br />
            <a href="http://www.amazon.com/exec/obidos/tg/browse/-/604878">Browse Magazine Subscriptions A-Z</a><br />
            <a href="http://www.amazon.com/ebooks">The E-Books Store</a><br />
            <a href="http://www.amazon.com">Site In General - Many Small Projects</a>    
        </p>
        <h2>Target Direct (<a href="http://www.Target.com/">www.Target.com</a>)</h2>
        <p>
            <a href="http://www.target.com/gp/gift-registries.html">Gift Registries</a> <span class="small">- Main areas of responsibility: adding/updating/buying registry items, email sending, e-mail templates, recommendation widgets, and many other smaller tasks.</span><br />
            <a href="http://www.target.com/gp/help/help-home.html?node=1039412">Help Section</a><br />	  
        </p>
        <h2>Other Projects</h2>
        <p>
            Web Developer/Designer: <a href="http://www.chimera-opus.com">The Art of Todd Morasch</a>
        </p>
      </div>
      <div class="grid_2">&nbsp;</div>
    
      <div class="clear"></div><!--seperator-->
      
      <div class="grid_2">&nbsp;</div>
      <div id="footer" class="grid_12">
          Copyright &copy; 2000-{$date}
      </div>
      <div class="grid_2">&nbsp;</div>