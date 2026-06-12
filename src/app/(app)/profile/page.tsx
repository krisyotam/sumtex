export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Profile
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Edit your profile, bio, and links.
      </p>
    </div>
  );
}
