import React, { useRef, useState, useEffect } from 'react';
import { Download, Shield, Plane, Radio, Check, Copy, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { trackEvent } from '../utils/analytics';

interface BadgeCardProps {
  role: 'cadet' | 'captain';
  memberNumber: string;
  name: string;
  memberSlug?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ role, memberNumber, name, memberSlug }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sigCopied, setSigCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [shareSupported, setShareSupported] = useState(false);
  
  const isCadet = role === 'cadet';
  const displayNum = memberNumber.replace('CAD', '').replace('AC', '');
  const formattedId = isCadet ? `#CAD${displayNum}` : `#AC${displayNum}`;
  
  const accentColor = isCadet ? '#38bdf8' : '#fb923c'; // cyan vs orange
  const glowShadow = isCadet 
    ? 'shadow-[0_0_40px_rgba(56,189,248,0.2)] border-sky-500/30' 
    : 'shadow-[0_0_40px_rgba(251,146,60,0.2)] border-orange-500/30';

  // Social Share Text (Proud national pride, UGC loops, attracting feeders and users)
  const shareText = isCadet
    ? `Proud to join India's sovereign airspace intelligence network as Founding AeroCadet ${formattedId}. Supporting the vision for a self-reliant aviation tracking grid. Join the network!`
    : `I've applied to become a Founding AeroCaptain (${formattedId}) to host a receiver and help build India's first sovereign airspace intelligence network. Proudly supporting Make in India aviation infrastructure. Apply to host a station:`;

  const inviteLink = `https://aerosky.ai/?ref=${memberSlug || (isCadet ? 'CAD' : 'AC') + displayNum}`;

  const signatureText = isCadet
    ? `Founding AeroCadet | Member ${formattedId} | Member Since 2026\nIndia's Airspace Intelligence Network | aerosky.ai`
    : `Founding AeroCaptain | Member ${formattedId} | Member Since 2026\nIndia's Airspace Intelligence Network | aerosky.ai`;

  useEffect(() => {
    // Check if Web Share is supported
    if (navigator.share) {
      setShareSupported(true);
    }

    // Generate browser preview QR code with standard margin
    QRCode.toDataURL(inviteLink, {
      margin: 4,
      width: 150,
      color: {
        dark: '#060e24',
        light: '#ffffff'
      }
    })
    .then(url => setQrUrl(url))
    .catch(err => console.error('Failed to generate preview QR:', err));
  }, [inviteLink]);

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    trackEvent('referral_link_copied', { role, memberNumber });
    setTimeout(() => setCopied(false), 2000);
  };

  const copySignature = () => {
    navigator.clipboard.writeText(signatureText);
    setSigCopied(true);
    trackEvent('email_signature_copied', { role, memberNumber });
    setTimeout(() => setSigCopied(false), 2000);
  };

  // Helper function to render all badge elements onto canvas
  const renderBadgeCanvas = async (ctx: CanvasRenderingContext2D) => {
    // 1. Draw premium dark background
    const bgGrad = ctx.createRadialGradient(600, 315, 50, 600, 315, 700);
    bgGrad.addColorStop(0, '#060b1c');
    bgGrad.addColorStop(1, '#02040a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Draw subtle coordinates grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // 3. Draw radar circles in background
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(950, 315, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(950, 315, 300, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(950, 315 - 340);
    ctx.lineTo(950, 315 + 340);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(950 - 340, 315);
    ctx.lineTo(950 + 340, 315);
    ctx.stroke();

    // 4. Draw Badge Frame (Left column)
    const cardX = 100;
    const cardY = 85;
    const cardW = 340;
    const cardH = 460;
    const radius = 24;

    // Badge Shadow Glow
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Badge Body
    ctx.fillStyle = '#060e24';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fill();

    // Reset shadow for inner drawings
    ctx.shadowBlur = 0;

    // Badge border (accent gradient)
    ctx.lineWidth = 2;
    const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    borderGrad.addColorStop(0, accentColor);
    borderGrad.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.strokeStyle = borderGrad;
    ctx.stroke();

    // Draw card background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 1;
    for (let cx = cardX + 20; cx < cardX + cardW; cx += 30) {
      ctx.beginPath();
      ctx.moveTo(cx, cardY);
      ctx.lineTo(cx, cardY + cardH);
      ctx.stroke();
    }
    for (let cy = cardY + 20; cy < cardY + cardH; cy += 30) {
      ctx.beginPath();
      ctx.moveTo(cardX, cy);
      ctx.lineTo(cardX + cardW, cy);
      ctx.stroke();
    }

    // 5. Draw Badge Content
    // Load and draw official AeroSky Logo
    try {
      const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = '/assets/logo.png';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Logo load failed'));
      });
      // Draw official logo image at cardX + 40, cardY + 38, width 120, height 36
      ctx.drawImage(logoImg, cardX + 40, cardY + 38, 120, 36);
    } catch (err) {
      console.error('Failed to draw official logo, using vector fallback:', err);
      // Logo Icon (AeroSky Plane design fallback)
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      const pX = cardX + 50;
      const pY = cardY + 55;
      ctx.moveTo(pX, pY - 15);
      ctx.lineTo(pX + 12, pY + 12);
      ctx.lineTo(pX + 3, pY + 8);
      ctx.lineTo(pX, pY + 15);
      ctx.lineTo(pX - 3, pY + 8);
      ctx.lineTo(pX - 12, pY + 12);
      ctx.closePath();
      ctx.fill();

      // Logo text fallback
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('AEROSKY', cardX + 78, cardY + 58);
    }

    // Decorative line
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, cardY + 95);
    ctx.lineTo(cardX + cardW - 40, cardY + 95);
    ctx.stroke();

    // Badge Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('FOUNDING MEMBER', cardX + 40, cardY + 140);

    // Role Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(isCadet ? 'AeroCadet' : 'AeroCaptain', cardX + 40, cardY + 180);

    // Member Name (User Name)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'italic 16px sans-serif';
    const dispName = name.length > 22 ? name.substring(0, 20) + '...' : name;
    ctx.fillText(dispName, cardX + 40, cardY + 220);

    // Unique Number
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 36px monospace';
    ctx.fillText(formattedId, cardX + 40, cardY + 290);

    // Metadata Footer inside badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('COHORT NO: 01', cardX + 40, cardY + 360);
    ctx.fillText('ESTABLISHED: 2026', cardX + 40, cardY + 380);
    
    // Draw real scannable QR code encoding the referral link with 4-module quiet zone margin
    const qrSize = 100;
    const qrX = cardX + cardW - qrSize - 40;
    const qrY = cardY + cardH - qrSize - 40;
    
    try {
      const qr = QRCode.create(inviteLink, { errorCorrectionLevel: 'M' });
      const moduleCount = qr.modules.size;
      
      const margin = 4;
      const totalModules = moduleCount + (margin * 2);
      const sizeOfBlock = qrSize / totalModules;

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);

      // Draw dark modules inside quiet zone
      ctx.fillStyle = '#060e24';
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qr.modules.get(r, c)) {
            ctx.fillRect(
              qrX + (c + margin) * sizeOfBlock,
              qrY + (r + margin) * sizeOfBlock,
              sizeOfBlock + 0.1,
              sizeOfBlock + 0.1
            );
          }
        }
      }
    } catch (err) {
      console.error('Failed to draw QR code on canvas:', err);
      // Fallback placeholder QR
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
    }

    // 6. Draw Content (Right Column)
    const textX = 500;

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 12px monospace';
    ctx.fillText('FOUNDING MEMBERSHIP BADGE', textX, 130);

    // Large Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText("India's Airspace Network", textX, 180);

    // Description text block (wrapped)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px sans-serif';
    const words = shareText.split(' ');
    let line = '';
    let currY = 230;
    const maxTextW = 600;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextW && n > 0) {
        ctx.fillText(line, textX, currY);
        line = words[n] + ' ';
        currY += 28;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, textX, currY);

    // Referral Invitation Footer
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(textX, 480);
    ctx.lineTo(1100, 480);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('AeroSky by AeroLytics', textX, 520);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px sans-serif';
    ctx.fillText(isCadet ? 'Community-powered airspace network.' : 'Independent aviation intelligence platform.', textX, 545);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`Join at: ${inviteLink}`, textX, 580);
  };

  const handleDownload = async () => {
    setDownloading(true);
    trackEvent('badge_download_started', { role, memberNumber });

    // Generate canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    await renderBadgeCanvas(ctx);

    // Save image
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `aerosky_badge_${role}_${displayNum}.png`;
      link.href = dataUrl;
      link.click();
      trackEvent('badge_download_completed', { role, memberNumber });
    } catch (e) {
      console.error('[Badge Download] Failed to trigger image download:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    setDownloading(true);
    trackEvent('badge_share_started', { role, memberNumber });

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    await renderBadgeCanvas(ctx);

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to generate blob from canvas');
          setDownloading(false);
          return;
        }

        const file = new File([blob], `aerosky_badge_${role}_${displayNum}.png`, { type: 'image/png' });
        
        const shareData: ShareData = {
          title: "AeroSky Founding Member Badge",
          text: `${shareText} ${inviteLink} #AeroSky #MakeInIndia`,
          url: inviteLink
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }

        await navigator.share(shareData);
        trackEvent('badge_share_completed', { role, memberNumber });
        setDownloading(false);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to share badge:', err);
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── Premium Digital Badge Card ── */}
      <div 
        className={`w-72 h-[410px] rounded-3xl p-6 relative overflow-hidden border bg-gradient-to-b from-[#091129] to-[#02050f] transition-all duration-500 hover:scale-[1.02] ${glowShadow} group`}
        style={{
          boxShadow: `0 0 35px rgba(${isCadet ? '56,189,248' : '251,146,60'}, 0.08)`
        }}
      >
        {/* Glow behind card */}
        <div 
          className="absolute -inset-10 opacity-20 bg-radial pointer-events-none group-hover:opacity-30 transition-opacity"
          style={{
            backgroundImage: `radial-gradient(circle, ${accentColor} 0%, transparent 60%)`
          }}
        />

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" className="h-7 object-contain" alt="AeroSky Logo" />
            </div>
            <div className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 text-[7px] font-mono font-bold tracking-wider text-sky-200/60 uppercase">
              FOUNDING MEMBER
            </div>
          </div>

          {/* Role details */}
          <div className="my-6">
            <div className="text-[9px] font-mono text-sky-200/70 uppercase tracking-widest mb-1">FOUNDING COHORT</div>
            <div className="text-2xl font-bold tracking-tight text-white">{isCadet ? 'AeroCadet' : 'AeroCaptain'}</div>
            <div className="text-xs text-sky-200/60 italic font-medium truncate mt-1">{name}</div>
          </div>

          {/* Large Number */}
          <div className="my-2">
            <div className="text-[9px] font-mono text-sky-200/70 uppercase tracking-widest mb-1.5">MEMBER SERIAL</div>
            <div className="text-3xl font-mono font-bold tracking-tight" style={{ color: accentColor }}>
              {formattedId}
            </div>
          </div>

          {/* Footer inside badge */}
          <div className="border-t border-white/[0.06] pt-4 mt-auto flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-[7px] font-mono text-sky-200/30 uppercase tracking-wider">ESTABLISHED</div>
              <div className="text-[9px] font-mono font-bold text-sky-200/70">2026</div>
            </div>
            
            {/* Real QR Code */}
            <div className="w-12 h-12 bg-white rounded p-0.5 flex items-center justify-center relative shadow-sm border border-white/10 overflow-hidden shrink-0">
              {qrUrl ? (
                <img src={qrUrl} alt="Referral QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
        >
          <Download size={12} className={downloading ? 'animate-bounce' : ''} />
          {downloading ? 'Preparing...' : 'Download Badge'}
        </button>

        {shareSupported && (
          <button
            onClick={handleShare}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            <Share2 size={12} className={downloading ? 'animate-pulse' : ''} />
            {downloading ? 'Preparing...' : 'Share Badge'}
          </button>
        )}

        <button
          onClick={copyInvite}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-black font-bold text-[10px] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,153,51,0.25)] hover:shadow-[0_0_30px_rgba(255,153,51,0.4)] cursor-pointer bg-gradient-to-br from-saffron to-gold"
        >
          {copied ? (
            <>
              <Check size={12} /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy Invite
            </>
          )}
        </button>
      </div>

      {/* Email Signature Section */}
      <div className="mt-6 w-full max-w-sm p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] text-center">
        <div className="text-[10px] font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-2">
          Email Signature
        </div>
        <pre className="text-[10px] font-mono text-sky-100/70 bg-black/30 p-2.5 rounded-lg border border-white/5 text-left whitespace-pre-line leading-relaxed">
          {signatureText}
        </pre>
        <button
          onClick={copySignature}
          className="mt-2.5 text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1 mx-auto cursor-pointer"
        >
          {sigCopied ? (
            <>
              <Check size={10} /> Copied Signature
            </>
          ) : (
            <>
              <Copy size={10} /> Copy Signature
            </>
          )}
        </button>
      </div>
    </div>
  );
};
