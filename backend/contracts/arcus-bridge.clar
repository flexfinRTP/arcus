(define-constant ERR-OWNER-ONLY (err u100)) ;; error if non-owner attempts to call function
(define-constant ERR-APPROVE-FAILED (err u101)) ;; error if approval transaction fails
(define-constant ERR-TRANSFER-FAILED (err u102)) ;; error if transfer transaction fails
(define-constant ERR-DEPOSIT-FAILED (err u103)) ;; error if deposit transaction fails

(define-data-var bridge-address principal "<insert Stacks bridge address here>") ;; address of the Stacks bridge for transferring sBTC

(define-public (deposit-btc (amount uint))
  (begin
    (with-foreign-contract
      '{
        "contract": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", ;; WBTC contract address on Ethereum. Need sbtc or susdt contract.
        "interface": "ERC20"
      }
      (let ((approve-result (call-func "approve" (list bridge-address amount))))
        (if (is-eq approve-result (ok true))
          (let ((transfer-result (call-func "transferFrom" (list tx-sender bridge-address amount))))
            (if (is-eq transfer-result (ok true))
              (let ((deposit-result (call-func "deposit-btc" (list amount))))
                (if (is-eq deposit-result (ok true))
                  (ok "BTC deposited successfully")
                  (err ERR-DEPOSIT-FAILED)
                )
              )
              (err ERR-TRANSFER-FAILED)
            )
          )
          (err ERR-APPROVE-FAILED)
        )
      )
    )
  )
)
