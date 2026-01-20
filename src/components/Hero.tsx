import profileImage from "@/assets/chillaura-profile.png";

const Hero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        {/* Profile image with glow */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
          <img
            src={profileImage}
            alt="ChillauraEditz"
            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-primary/50 object-cover animate-float"
          />
        </div>

        {/* Channel name */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-glow-cyan">
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
            ChillauraEditz
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-2">
          @ChillauraMPG
        </p>

        <p className="text-muted-foreground max-w-md mb-8">
          🎮 Gaming • 🎄 Christmas Games • 🎃 Halloween Games • 🕹️ Fun Mini-Games
        </p>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span className="px-4 py-2 bg-card rounded-full border border-border">
            294+ Subscribers
          </span>
          <span className="px-4 py-2 bg-card rounded-full border border-border">
            242+ Videos
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
