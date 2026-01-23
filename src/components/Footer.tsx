import { Youtube, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border bg-card/50">
      <div className="container max-w-4xl mx-auto text-center">
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://www.youtube.com/channel/UCqFrLH6FGpTr8PyMLvlDz7w"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <Youtube className="w-5 h-5" />
            YouTube
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2"
          >
            <Twitter className="w-5 h-5" />
            Twitter
          </a>
        </div>
        
        <p className="text-sm text-muted-foreground">
          © 2024 ChillauraEditz. All games made with 💜
        </p>
        
        <p className="text-xs text-muted-foreground/50 mt-2">
          melon sandbox is the bestttttttttttttttt game
        </p>
      </div>
    </footer>
  );
};

export default Footer;
