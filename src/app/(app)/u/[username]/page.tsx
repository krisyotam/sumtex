interface Props {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        {username}
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Public profile with spider graph and contribution history.
      </p>
    </div>
  );
}
