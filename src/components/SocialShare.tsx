import { Facebook, Twitter, Linkedin, Link2, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || "";

  const handleShare = (platform: string) => {
    let shareLink = "";
    
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDescription + "\n\n" + shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-neutral-600 mr-2">Share:</span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("facebook")}
        className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("twitter")}
        className="hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("linkedin")}
        className="hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("email")}
        className="hover:bg-neutral-50 hover:border-neutral-700"
        aria-label="Share via Email"
      >
        <Mail className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        className="hover:bg-green-50 hover:border-green-600 hover:text-green-600"
        aria-label="Copy link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
