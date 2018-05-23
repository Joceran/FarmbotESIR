describe User do
  describe '#new' do
    it 'Creates a new user' do
      expect(User.new).to be_kind_of(User)
    end
  end

  describe 'SKIP_EMAIL_VALIDATION' do
    let (:user) { FactoryBot.create(:user, confirmed_at: nil) }

    it 'considers al users verified when set to `true`' do
      const_reassign(User, :SKIP_EMAIL_VALIDATION, true)
      expect(user.verified?).to be(true)
      const_reassign(User, :SKIP_EMAIL_VALIDATION, false)
    end

    it 'does not skip when false' do
      const_reassign(User, :SKIP_EMAIL_VALIDATION, false)
      expect(user.verified?).to be(false)
    end
  end
end
