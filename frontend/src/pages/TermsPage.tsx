const SECTIONS: [string, string][] = [
  [
    '1. Acceptance of terms',
    "By using Snaply, you agree to these terms. If you don't agree, please don't use the service.",
  ],
  [
    '2. What Snaply is for',
    'Snaply is provided for personal, non-commercial use — downloading videos and audio that you own, have permission to use, or are otherwise legally entitled to download for offline personal use.',
  ],
  [
    '3. Your responsibility',
    "You are solely responsible for how you use downloaded content. You must comply with YouTube's Terms of Service, applicable copyright law, and the rights of content creators. Do not use Snaply to redistribute, sell, or publicly share copyrighted material without permission.",
  ],
  [
    '4. No affiliation',
    'Snaply is an independent tool and is not affiliated with, endorsed by, or sponsored by YouTube or Google LLC.',
  ],
  [
    '5. No warranty',
    'Snaply is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability, accuracy, or that every download will succeed.',
  ],
  [
    '6. Limitation of liability',
    'We are not liable for any damages, losses, or legal consequences arising from your use of this service or from content you download through it.',
  ],
  [
    '7. Changes to these terms',
    'We may update these terms from time to time. Continued use of Snaply after changes means you accept the updated terms.',
  ],
  [
    '8. Contact',
    'Questions about these terms can be directed to the site operator.',
  ],
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14 space-y-8">
      <header className="text-center space-y-3 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Terms &amp; Conditions</h1>
        <p className="text-yt-gray text-sm">Please read these terms carefully before using Snaply.</p>
      </header>

      <div className="bg-yt-surface border border-yt-border rounded-xl p-6 space-y-6 animate-fade-in-up">
        {SECTIONS.map(([title, body]) => (
          <div key={title} className="space-y-1.5">
            <h2 className="font-semibold text-sm">{title}</h2>
            <p className="text-sm text-yt-gray leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
