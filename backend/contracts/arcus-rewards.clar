;; constants
(define-constant SECONDS-IN-DAY 86400)
(define-constant REWARD-AMOUNT 10000) ;; in sats

;; data maps and vars
(define-data-var rewards (map (key (buff 20)) (value uint))) ; reward amounts for each user
(define-data-var users-withdrawals (map (key (buff 20)) (value (tuple uint uint (buff 20))))); withdrawal amounts, timestamps and reserve address for each user

;; functions

;; returns the current time in seconds
(define (get-current-time)
  (udiv (now) 1000000))

;; returns the reward amount
(define (get-reward-amount)
  REWARD-AMOUNT)

;; returns the reward token
(define (get-reward-token)
  (if (eq? (get-block-info 'height) 1)
    (unwrap-err (get-balance self))
    (unwrap-err (ft-get-balance self))))

;; pays out rewards to a user's defined sBTC reserve address
(define (payout-rewards-to-user user-addr reserve-addr)
  (let* ((current-time (get-current-time))
         (withdrawal-info (map-get users-withdrawals user-addr)))
    (if (or (is-none withdrawal-info)
            (>= (- current-time (tuple-get withdrawal-info 1)) (* SECONDS-IN-DAY 7)))
      ;; payout rewards
      (begin
        (let ((reward-token (get-reward-token)))
          (if (is-some reward-token)
            (let ((reward-amount (get-reward-amount)))
              (ft-transfer self reward-amount reward-token reserve-addr)
              (map-set rewards user-addr 0))
            (ok "No reward tokens available")))
        ;; update user withdrawal info
        (map-set users-withdrawals user-addr (some (tuple (* 0.75 (map-get rewards user-addr)) current-time reserve-addr)))
        (ok "User rewarded"))
      ;; withdrawal not allowed yet
      (err "Withdrawal not allowed yet. Wait for 7 days or until lockup period ends"))))

;; allows a user to withdraw their rewards to their defined sBTC reserve address
(define-public (withdraw reserve-addr)
  (payout-rewards-to-user tx-sender reserve-addr))
